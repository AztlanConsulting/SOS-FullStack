import { Router } from 'express';
import { CreateWorkshopItemController } from '@interfaces/controllers/createWorkshopItem.controller';

const router = Router();

router.post('/', CreateWorkshopItemController.handle);

export default router;
