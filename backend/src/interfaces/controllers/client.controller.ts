import { safeParse } from 'zod';
import type { Request, Response } from 'express';
import { userDataAccess } from '@/infrastructure/data-access/user.data-access';
import { getClientById } from '@/use-cases/clients/getClientById.usecase';
import { getClients } from '@/use-cases/clients/getClients.usecase';
import { updateClient } from '@/use-cases/clients/updateClient.usecase';
import { updatePlanStatus } from '@/use-cases/clients/updatePlanStatus.usecase';
import { purchasedPlanDataAccess } from '@/infrastructure/data-access/purchasedPlan.data-access';
import { notesSchema } from '@/types/clients.type';

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
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const status = req.query.status as string | undefined;
      const conversation = req.query.conversation as 'con' | 'sin' | undefined;
      const result = await getClients(deps, {
        page,
        search,
        limit,
        status,
        conversation,
      });
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
   * HTTP Request Handler to modify the operational status of an active subscription plan.
   * * Validates input parameters before delegating execution to the business logic use case.
   * * @route PUT /api/plans/:planId/status
   * @param req - Express incoming HTTP request context structure carrying `planId` parameters and a `status` string payload.
   * @param res - Express outgoing HTTP response channel context object.
   * @returns {Promise<void>} Sends a 200 JSON success confirmation or an appropriate error code status.
   */
  updatePlanStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const planId = Array.isArray(req.params.planId)
        ? req.params.planId[0]
        : req.params.planId;
      const { status } = req.body;

      if (!planId || typeof planId !== 'string') {
        res.status(400).json({ error: 'Invalid plan id' });
        return;
      }

      await updatePlanStatus(
        { purchasedPlanRepository: purchasedPlanDataAccess },
        planId,
        status,
      );
      res.status(200).json({ message: 'Plan status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating plan status' });
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
      const body = notesSchema.safeParse(req.body);

      if (body.error) {
        res.status(401).send(body.error);
        return;
      }

      const { conversation, notes, publicNote } = body.data;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid client id' });
        return;
      }

      await updateClient(deps, id, { conversation, notes, publicNote });
      res.status(200).json({ message: 'Client updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating client' });
    }
  },
};
