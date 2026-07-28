import { Types } from 'mongoose';
import type { FoundPetReport } from '@domain/models/foundPet.model';
import type { PetImageDto } from '@domain/repositories/petImage.repository';
import { createFoundPet } from '@use-cases/foundPet/createFoundPet.usecase';
import logger from '@/utils/logger';
import { parseBase64Image } from '@use-cases/foundPet/parseBase64Image.usecase';
import type { Request, Response } from 'express';
import { FoundPetDataAccess } from '@/infrastructure/data-access/foundPet.data-access';
import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';
import getLocation from '@/utils/getLocation.mapper';
import type { GeocodingResult } from '@/types/pet.types';
import { foundPet } from '@/types/foundPet.types';

export async function postFoundPetReport(req: Request, res: Response) {
  try {
    const body = foundPet.safeParse(req.body);

    if (body.error) {
      logger.error('postFoundPetReport validation failed', {
        error: body.error,
        body: req.body,
      });
      throw body.error;
    }

    const {
      species,
      date,
      breed,
      sex,
      color,
      size,
      description,
      location,
      locationCoords,
      contactName,
      phoneNumber,
      email,
      images,
    } = body.data;
    if (!images || !Array.isArray(images) || images.length === 0) {
      logger.warn('postFoundPetReport invalid or missing images', {
        body: req.body,
      });
      return res.status(400).json({
        error: 'Invalid or missing images',
        details: 'At least one valid base64 image is required',
      });
    }

    const imageBuffers = images.map(parseBase64Image);

    if (imageBuffers.some((buffer) => buffer === null)) {
      return res.status(400).json({
        error: 'Invalid or missing images',
        details: 'All images must be valid base64 strings',
      });
    }

    const customId = new Types.ObjectId();
    const imageIds = imageBuffers.map((_, i) => `${customId}_img_${i}`);

    const requestLocation: GeocodingResult =
      (process.env.ENV === 'develop' && req.body.defaultLocation) ||
      (await getLocation(locationCoords)) ||
      getOpenStreetMapLocation(location, locationCoords);

    if (!Boolean(requestLocation)) throw Error("Couldn't get location");

    const foundPetData: FoundPetReport = {
      _id: customId,
      species,
      date,
      breed: breed.slice(0, 40),
      sex: sex as 'Macho' | 'Hembra' | 'Desconocido',
      color: color.slice(0, 40),
      size: size as
        | 'Mini: 1 a 4 kg'
        | 'Pequeña: 5 a 10 kg'
        | 'Mediana: 11 a 25 kg'
        | 'Grande: 26 a 45 kg'
        | 'Gigante: más de 45 kg',
      description,
      location: requestLocation,
      contactName: contactName.slice(0, 40),
      phoneNumber,
      email: email.slice(0, 128),
      imageIds,
    };

    for (let i = 0; i < imageBuffers.length; i++) {
      const petImageDto: PetImageDto = {
        refId: imageIds[i],
        image: imageBuffers[i] as Buffer,
        species,
        color,
        location: [
          requestLocation?.properties.city ?? requestLocation?.properties.state,
          requestLocation?.properties.state,
          requestLocation?.properties.country,
        ]
          .filter((loc) => loc)
          .join(', '),
      };

      await petVector.createPetImage(petImageDto);
    }

    const result = await createFoundPet(FoundPetDataAccess, foundPetData);

    return res.status(201).json({
      message: 'Found pet report created successfully',
      data: result,
    });
  } catch (error) {
    logger.error('postFoundPetReport error', {
      error,
      body: req.body,
    });
    return res.status(500).json({
      error:
        'Ocurrió un error inesperado. Vuelva a intentarlo en unos minutos.',
    });
  }
}

const getOpenStreetMapLocation = (
  location: string,
  locationCoords: [number, number],
) => {
  const locationArray = location.split(',');
  return {
    coords: locationCoords,
    displayName: location,
    properties: {
      city: locationArray[0],
      state: locationArray.length < 3 ? locationArray[0] : locationArray[1],
      country: locationArray.length < 3 ? locationArray[1] : locationArray[2],
    },
  };
};
