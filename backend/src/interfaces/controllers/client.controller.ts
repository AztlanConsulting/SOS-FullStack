import type { Request, Response } from 'express';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { getClientById } from '@/use-cases/clients/getClientById.usecase';
import { getClients } from '@/use-cases/clients/getClients.usecase';
import { updateClient } from '@/use-cases/clients/updateClient.usecase';

/**
 * Dependency Injection setup.
 * Bridges the infrastructure layer (Data Access) with the application layer (Use Cases).
 */
const deps = { userRepository: userDataAccess };

/**
 *
 * Handles incoming HTTP requests related to client management.
 * Responsibilities include:
 * - Extracting and validating request parameters/body.
 * - Calling the appropriate Use Case.
 * - Returning standardized JSON responses and HTTP status codes.
 */
export const ClientController = {
  /**
   * GET /clients
   * Retrieves a paginated list of clients with optional search filtering.
   */
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

  /**
   * GET /clients/:id
   * Fetches detailed information for a single client by their ID.
   */
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

  /**
   * PATCH/PUT /clients/:id
   * Updates specific client fields (currently focused on conversation notes).
   */
  updateClient: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { conversation } = req.body;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid client id' });
        return;
      }

      await updateClient(deps, id, { conversation });
      res.status(200).json({ message: 'Client updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating client' });
    }
  },
};
