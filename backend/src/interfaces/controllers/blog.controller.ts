import type { Request, Response } from 'express';
import type { Blog } from '@domain/models/blog.model';
import { BlogDataAccess } from '@infrastructure/data-access/blog.data-access';
import { blogQuery } from '@validation/blog.types';
import { getBlogsList, getBlogById } from '@use-cases/blogs/getBlogs.usecase';

export async function getBlogs(req: Request, res: Response) {
  try {
    const query = blogQuery.safeParse(req.query);

    if (!query.success) {
      throw query.error;
    }

    const id = query.data.id;

    let result: Blog[] | Blog;
    let total: number = 0;

    if (id !== undefined) {
      const blog = await getBlogById(BlogDataAccess, id);
      if (blog) {
        result = blog;
      } else {
        return res.status(404).send(`No se encontró el blog con id: ${id}`);
      }
    } else {
      const blogs = await getBlogsList(BlogDataAccess, query.data);
      result = blogs.blogs;
      total = blogs.totalBlogs;
    }

    return res.status(200).json({ result, total });
  } catch (error) {
    res.status(500).send(error);
  }
}

export default { getBlogs };
