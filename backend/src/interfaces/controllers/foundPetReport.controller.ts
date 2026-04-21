import type { FoundPetReport } from '@domain/models/foundPet.model';
import { FoundPetDataAccess } from '@interfaces/data-access/foundPet.data-access';
import { createFoundPet } from '@use-cases/foundPet/createFoundPet.usecase';
import type { Request, Response } from 'express';

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
    } = req.body;

    const foundPetData: FoundPetReport = {
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
    };

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
