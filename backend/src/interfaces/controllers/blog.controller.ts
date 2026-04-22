import type { Request, Response } from 'express';
import { BlogDataAccess } from '@infrastructure/data-access/blog.data-access';
import { blogQuery } from '@validation/blog.types';
import { getBlogsList, getBlogById } from '@use-cases/blogs/getBlogs.usecase';

export async function getBlogs(req: Request, res: Response) {
  try {
    const query = blogQuery.safeParse(req.query);

    if (!query.success) {
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
    return res.status(500).send(error);
  }
}

export default { getBlogs };
