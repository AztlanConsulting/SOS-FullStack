import express from 'express';
import authController from '@interfaces/controllers/auth.controller';
import {
  loginLimiter,
  passwordResetLimiter,
} from '@interfaces/middleware/rateLimit.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post(
  '/forgot-password',
  passwordResetLimiter,
  authController.forgotPassword,
);
router.get(
  '/reset-password/validate',
  authController.validateResetPasswordToken,
);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authMiddleware, authController.me);

export default router;
