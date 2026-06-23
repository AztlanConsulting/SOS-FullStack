import type { BlogRepository } from '@/domain/repositories/blog.repository';

async function getBlogStatsUC(blogRepository: BlogRepository) {
  const numState = await blogRepository.countState();
  const comparison = await blogRepository.getPercentageChange();

  return { numState, comparison };
}

export default getBlogStatsUC;
