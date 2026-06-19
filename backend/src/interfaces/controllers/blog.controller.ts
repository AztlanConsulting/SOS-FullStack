import type { Request, Response } from 'express';
import { BlogDataAccess } from '@infrastructure/data-access/blog.data-access';
import { blogQuery, blogSchema, editBlogSchema } from '@validation/blog.types';
import { getBlogsList, getBlogById } from '@use-cases/blogs/getBlogs.usecase';
import createBlogUC from '@/use-cases/blogs/createBlog.usecase';
import editBlogUC from '@/use-cases/blogs/editBlog.usecase';
import deleteBlogUC from '@/use-cases/blogs/deleteBlog.usecase';

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

async function createBlog(req: Request, res: Response) {
  try {
    const blogData = blogSchema.safeParse(req.body);

    if (blogData.error) return res.status(401).json(blogData.error);

    const blog = await createBlogUC(BlogDataAccess, blogData.data);

    if (blog) return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return res.status(500).send(error);
  }
}

async function deleteBlog(req: Request, res: Response) {
  try {
    const { _id: blogId } = req.body;

    if (!blogId) return res.status(401).json('Blog id not provided');

    const blog = await deleteBlogUC(BlogDataAccess, blogId);

    if (blog) return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export default { getBlogs, createBlog, updateBlog, deleteBlog };
