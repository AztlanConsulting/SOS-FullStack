import type { Request, Response } from 'express';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { getClientById } from '@/use-cases/clients/getClientById.usecase';
import { getClients } from '@/use-cases/clients/getClients.usecase';

const deps = { userRepository: userDataAccess };

export const ClientController = {
  getClients: async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const search = req.query.search as string | undefined;
      const result = await getClients(deps, { page, search });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching clients' });
    }
  },

  getClientById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const client = await getClientById(deps, id);
      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching client' });
    }
  },
};
