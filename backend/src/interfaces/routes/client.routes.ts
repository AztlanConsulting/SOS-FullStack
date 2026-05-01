import express from 'express';
import { ClientController } from '../controllers/client.controller';

const router = express.Router();

router.get('/', ClientController.getClients);
router.get('/:id', ClientController.getClientById);

export default router;
