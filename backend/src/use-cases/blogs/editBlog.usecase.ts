import type {
  BlogRepository,
  CreateBlog,
} from '@/domain/repositories/blog.repository';

async function editBlogUC(
  blogProvider: BlogRepository,
  blogData: Partial<CreateBlog>,
) {
  const blog = await blogProvider.editBlog(blogData);
  return blog;
}

export default editBlogUC;
