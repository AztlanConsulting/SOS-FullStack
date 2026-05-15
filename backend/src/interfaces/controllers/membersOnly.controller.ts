import type { Request, Response } from 'express';
import { MembersOnlyDataAccess } from '@infrastructure/data-access/membersOnly.data-access';
import {
  membersOnlyQuery,
  membersOnlyBody,
} from '@validation/membersOnly.types';
import {
  getMembersOnlyList,
  getMembersOnlyById,
  createMembersOnly,
  getMemberFilePath,
} from '@use-cases/members-only/getMembersOnly.usecase';
import fs from 'fs';
import path from 'path';

export async function getMembersOnly(req: Request, res: Response) {
  try {
    const query = membersOnlyQuery.safeParse(req.query);

    if (!query.success) {
      return res.status(400).json(query.error);
    }

    const { id } = query.data;

    if (id !== undefined) {
      const item = await getMembersOnlyById(MembersOnlyDataAccess, id);

      if (!item) {
        return res
          .status(404)
          .send(`No se encontró el contenido con id: ${id}`);
      }

      return res.status(200).json({
        membersOnly: [item],
        total: 1,
      });
    }

    const { membersOnly, total } = await getMembersOnlyList(
      MembersOnlyDataAccess,
      query.data,
    );

    return res.status(200).json({ membersOnly, total });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function postMembersOnly(req: Request, res: Response) {
  try {
    const body = membersOnlyBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json(body.error);
    }

    const created = await createMembersOnly(MembersOnlyDataAccess, body.data);

    return res.status(201).json({ membersOnly: created });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getMemberFile(req: Request, res: Response) {
  try {
    const { filename } = req.params;
    if (typeof filename !== 'string') {
      return res.status(400).send('Invalid filename');
    }
    const filePath = getMemberFilePath(filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    return res.sendFile(filePath);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default { getMembersOnly, postMembersOnly, getMemberFile };
