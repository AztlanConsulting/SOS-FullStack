import { Router } from 'express';
import { getResources } from '../controllers/resource.controller';
import updateResource from '../controllers/updateResource.controller';

const router = Router();

router.get('/', getResources);
router.put('/', updateResource);

export default router;
