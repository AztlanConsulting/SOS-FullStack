import express from 'express';
import updateResource from '../controllers/updateResource.controller';

const router = express.Router();

router.put('/', updateResource);

export default router;
