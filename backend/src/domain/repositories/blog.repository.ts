import type { Blog } from '@/domain/models/blog.model';

export interface BlogQuery {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface BlogRepository {
  getBlogs(query: BlogQuery): Promise<Blog[]>;
  getBlogById(id: string): Promise<Blog | null>;
  getTotalBlogs(query: BlogQuery): Promise<number>;
}
