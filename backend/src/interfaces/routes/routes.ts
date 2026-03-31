import express from 'express';
import imageRouter from './images.routes';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

router.use('/images', imageRouter);

export default router;
