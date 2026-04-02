import express from 'express';
import clientsController from '../controllers/clients.controller';

const router = express.Router();

router.post('/publish', clientsController.publishPet);

export default router;
