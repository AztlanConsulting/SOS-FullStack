import express from 'express';
import blogController from '@interfaces/controllers/blog.controller';

const router = express.Router();

router.get('/', blogController.getBlogs);
router.get('/stats', blogController.getStats);
router.post('/', blogController.createBlog);
router.put('/', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);

export default router;
