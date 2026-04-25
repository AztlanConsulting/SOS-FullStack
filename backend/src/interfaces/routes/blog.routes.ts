import express from 'express';
import blogController from '@interfaces/controllers/blog.controller';

const router = express.Router();

router.get('/', blogController.getBlogs);

export default router;
