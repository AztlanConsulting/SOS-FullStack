import type { Blog } from '@/domain/models/blog.model';

export interface BlogRequest {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface BlogRepository {
  getBlogs(query: BlogRequest): Promise<Blog[]>;
  getBlogById(id: string): Promise<Blog | null>;
  getTotalBlogs(query: BlogRequest): Promise<number>;
}
