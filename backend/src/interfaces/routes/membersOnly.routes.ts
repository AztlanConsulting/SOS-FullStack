import express from 'express';
import membersOnlyController from '@interfaces/controllers/membersOnly.controller';

const router = express.Router();

router.get('/', membersOnlyController.getMembersOnly);
router.post('/', membersOnlyController.postMembersOnly);

export default router;
