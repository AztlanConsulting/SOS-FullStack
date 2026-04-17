import express from 'express';
import authController from '@interfaces/controllers/auth.controller';

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

export default router;
