import type {
  BlogRepository,
  EditBlog,
} from '@/domain/repositories/blog.repository';

async function editBlogUC(blogProvider: BlogRepository, blogData: EditBlog) {
  const blog = await blogProvider.editBlog(blogData);
  return blog;
}

export default editBlogUC;
