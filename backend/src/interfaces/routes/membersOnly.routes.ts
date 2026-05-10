import express from 'express';
import membersOnlyController from '@interfaces/controllers/membersOnly.controller';

const router = express.Router();

router.get('/', membersOnlyController.getMembersOnly);
router.post('/', membersOnlyController.postMembersOnly);
router.get('/file/:filename', membersOnlyController.getMemberFile);

export default router;
