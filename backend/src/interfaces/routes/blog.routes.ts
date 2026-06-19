import express from 'express';
import blogController from '@interfaces/controllers/blog.controller';

const router = express.Router();

router.get('/', blogController.getBlogs);
router.post('/', blogController.createBlog);
router.put('/', blogController.updateBlog);
router.delete('/', blogController.deleteBlog);

export default router;
