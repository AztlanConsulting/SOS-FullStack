import BlogsPage from '@pages/BlogPage';
import BlogPage from '@pages/BlogPostPage';

const router = [
  {
    path: '/blog',
    element: <BlogsPage />,
  },
  {
    path: '/blog/:id',
    element: <BlogPage />,
  },
];

export default router;
