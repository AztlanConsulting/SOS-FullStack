import express from 'express';
import { ClientController } from '../controllers/client.controller';

const router = express.Router();

/**
 * @desc    Fetch a paginated list of clients with optional search filters.
 * @access  Protected (Admin)
 */
router.get('/', ClientController.getClients);
/**
 * @route   GET /api/clientes/:id
 * @desc    Retrieve full details of a specific client by ID.
 * @access  Protected
 */
router.get('/:id', ClientController.getClientById);
/**
 * @route   PUT /api/clientes/:id
 * @desc    Update client information
 * @access  Protected
 */
router.put('/:id', ClientController.updateClient);

export default router;
