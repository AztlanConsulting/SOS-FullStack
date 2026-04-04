import express from 'express';
import { LocationController } from '../controllers/LocationController';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Health-check successfull');
});

//Route for the Ip based geolocation.
router.get('/ip', LocationController.handle);

export default router;
