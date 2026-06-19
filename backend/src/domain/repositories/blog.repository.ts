import type { Blog } from '@/domain/models/blog.model';

export interface BlogRequest {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export type CreateBlog = Omit<Blog, 'createdAt' | 'updatedAt'>;

export interface BlogRepository {
  getBlogs(query: BlogRequest): Promise<Blog[]>;
  getBlogById(id: string): Promise<Blog | null>;
  getTotalBlogs(query: BlogRequest): Promise<number>;
  registerBlog(blog: CreateBlog): Promise<Blog>;
  editBlog(blog: Partial<CreateBlog>): Promise<Blog | null>;
  deleteBlog(blogId: string): Promise<Blog | null>;
}
