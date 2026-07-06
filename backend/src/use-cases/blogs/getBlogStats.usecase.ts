import type { BlogRepository } from '@/domain/repositories/blog.repository';

async function getBlogStatsUC(blogRepository: BlogRepository) {
  const { published, drafts } = await blogRepository.countState();
  const comparison = await blogRepository.getPercentageChange();

  return { published, drafts, comparison };
}

export default getBlogStatsUC;
