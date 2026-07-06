import type { BlogRepository } from '@/domain/repositories/blog.repository';

async function deleteBlogUC(blogProvider: BlogRepository, blogId: string) {
  const blog = await blogProvider.deleteBlog(blogId);
  return blog;
}

export default deleteBlogUC;
