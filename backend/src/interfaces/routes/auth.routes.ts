import express from 'express';
import authController from '@interfaces/controllers/auth.controller';
import { loginLimiter } from '@interfaces/middleware/rateLimit.middleware';

const router = express.Router();

router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
