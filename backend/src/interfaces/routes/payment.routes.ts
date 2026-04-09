import captureOrder from '@interfaces/controllers/captureOrder.controller';
import createOrder from '@interfaces/controllers/createOrder.controller';
import express from 'express';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/capture-order/:orderId', captureOrder);

export default router;
