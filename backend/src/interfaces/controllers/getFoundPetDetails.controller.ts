import { FoundPetDataAccess } from '@/infrastructure/data-access/foundPet.data-access';
import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';
import getPetDetails from '@/use-cases/foundPet/getPetDetails.usecase';
import type { Request, Response } from 'express';
import z, { safeParse } from 'zod';

async function getFoundPetDetails(req: Request, res: Response) {
  try {
    const params = safeParse(z.object({ id: z.string() }), req.params);

    if (params.error) {
      console.error(params.error);
      throw Error("Coudln't parse ID from params");
    }

    const { id } = params.data;

    const petDetails = await getPetDetails(
      {
        foundPetRepository: FoundPetDataAccess,
        petVector,
      },
      id,
    );

    res.status(200).send(petDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(`Error fetching petDetails with id: ${req.params.id ?? undefined}`);
  }
}

export default getFoundPetDetails;
