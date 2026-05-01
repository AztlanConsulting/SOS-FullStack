import { Types } from 'mongoose';
import type { FoundPetReport } from '@domain/models/foundPet.model';
import type { PetImageDto } from '@domain/repositories/petImage.repository';
import { createFoundPet } from '@use-cases/foundPet/createFoundPet.usecase';
import { parseBase64Image } from '@use-cases/foundPet/parseBase64Image.usecase';
import type { Request, Response } from 'express';
import { FoundPetDataAccess } from '@/infrastructure/data-access/foundPet.data-access';
import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';

export async function postFoundPetReport(req: Request, res: Response) {
  try {
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
    } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
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

    const foundPetData: FoundPetReport = {
      _id: customId,
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
      imageIds,
    };

    for (let i = 0; i < imageBuffers.length; i++) {
      const petImageDto: PetImageDto = {
        refId: imageIds[i],
        image: imageBuffers[i] as Buffer,
        species,
      };

      await petVector.createPetImage(petImageDto);
    }

    const result = await createFoundPet(FoundPetDataAccess, foundPetData);

    return res.status(201).json({
      message: 'Found pet report created successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Error creating found pet report',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
