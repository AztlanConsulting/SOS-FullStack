import type {
  BlogRepository,
  CreateBlog,
} from '@/domain/repositories/blog.repository';

async function createBlogUC(
  blogProvider: BlogRepository,
  blogData: CreateBlog,
) {
  const blog = await blogProvider.registerBlog(blogData);
  return blog;
}

export default createBlogUC;
