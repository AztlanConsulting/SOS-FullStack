import express from 'express';
import membersOnlyController from '@interfaces/controllers/membersOnly.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, membersOnlyController.getMembersOnly);
router.post('/', authMiddleware, membersOnlyController.postMembersOnly);
router.get(
  '/file/:filename',
  authMiddleware,
  membersOnlyController.getMemberFile,
);

export default router;
