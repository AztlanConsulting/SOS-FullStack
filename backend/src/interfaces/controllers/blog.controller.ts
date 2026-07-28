import type { Request, Response } from 'express';
import { BlogDataAccess } from '@infrastructure/data-access/blog.data-access';
import { blogQuery, blogSchema, editBlogSchema } from '@validation/blog.types';
import { getBlogsList, getBlogById } from '@use-cases/blogs/getBlogs.usecase';
import createBlogUC from '@/use-cases/blogs/createBlog.usecase';
import editBlogUC from '@/use-cases/blogs/editBlog.usecase';
import deleteBlogUC from '@/use-cases/blogs/deleteBlog.usecase';
import getBlogStatsUC from '@/use-cases/blogs/getBlogStats.usecase';
import logger from '@/utils/logger';

export async function getBlogs(req: Request, res: Response) {
  try {
    const query = blogQuery.safeParse(req.query);

    if (!query.success) {
      logger.error('getBlogs validation failed', { error: query.error });
      return res.status(400).json(query.error);
    }

    const { id } = query.data;

    if (id != undefined) {
      const blog = await getBlogById(BlogDataAccess, id);

      if (!blog) {
        return res.status(404).send(`No se encontró el blog con id: ${id}`);
      }

      return res.status(200).json({
        blogs: [blog],
        total: 1,
      });
    }

    const { blogs, totalBlogs } = await getBlogsList(
      BlogDataAccess,
      query.data,
    );

    return res.status(200).json({
      blogs,
      total: totalBlogs,
    });
  } catch (error) {
    logger.error('getBlogs error', { error });
    return res.status(500).send(error);
  }
}

async function getStats(req: Request, res: Response) {
  try {
    const blogStats = await getBlogStatsUC(BlogDataAccess);
    return res.status(200).json(blogStats);
  } catch (error) {
    logger.error('getStats error', { error });
    return res.status(500).send(error);
  }
}

async function createBlog(req: Request, res: Response) {
  try {
    const blogData = blogSchema.safeParse(req.body);

    if (blogData.error) return res.status(401).json(blogData.error);

    const blog = await createBlogUC(BlogDataAccess, blogData.data);

    if (blog) return res.status(200).json(blog);
  } catch (error) {
    logger.error('createBlog error', { error });
    return res.status(500).send(error);
  }
}

async function updateBlog(req: Request, res: Response) {
  try {
    const blogData = editBlogSchema.safeParse(req.body);

    if (blogData.error) return res.status(401).json(blogData.error);

    const blog = await editBlogUC(BlogDataAccess, blogData.data);

    if (blog) return res.status(200).json(blog);
  } catch (error) {
    logger.error('updateBlog error', { error });
    return res.status(500).send(error);
  }
}

async function deleteBlog(req: Request, res: Response) {
  try {
    const { blogId } = req.params;

    if (!blogId) return res.status(401).json('Blog id not provided');

    const blog = await deleteBlogUC(BlogDataAccess, blogId as string);

    if (blog) return res.status(200).json(blog);
  } catch (error) {
    logger.error('deleteBlog error', { error });
    return res.status(500).send(error);
  }
}

export default { getBlogs, getStats, createBlog, updateBlog, deleteBlog };
