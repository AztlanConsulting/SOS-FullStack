import loginController from '@interfaces/controllers/login.controller';
import registerController from '@interfaces/controllers/register.controller';
import express from 'express';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);

export default router;
