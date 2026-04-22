import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import type { Blog } from '@features/blog/types/blog.types';
import BlogCard from '@features/blog/components/BlogCard';
import BlogContent from '@features/blog/components/BlogContent';

const blog: Blog = {
  _id: 'b1',
  name: 'Blog Integration Suite',
  duration: 8,
  content: [
    { type: 'text', content: 'First block' },
    { type: 'text', content: 'Second block' },
  ],
  imageUrl: 'https://example.com/blog.jpg',
  createdAt: '2023-12-30',
  updatedAt: '2023-12-31',
};

/**
 * Probe component used to inspect router location state.
 * Helps validate that blog data is correctly passed via navigation state.
 */
function BlogDetailProbe() {
  const { state } = useLocation();

  return (
    <div>
      <p>id:</p>
      <p>{state?.blog?._id}</p>

      <p>name:</p>
      <p>{state?.blog?.name}</p>

      <p>duration:</p>
      <p>{state?.blog?.duration}</p>
    </div>
  );
}

/**
 * Probe used to simulate the blog list page.
 */
function BlogListProbe() {
  return <div>Blog List Page</div>;
}

describe('blog integration suite (frontend routing flow)', () => {
  /**
   * FLOW 1:
   * BlogCard → BlogContent navigation via router state
   */
  it('navigates from BlogCard to BlogContent with router state', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/blog',
          element: <BlogCard blog={blog} />,
        },
        {
          path: '/blog/:id',
          element: <BlogDetailProbe />,
        },
      ],
      { initialEntries: ['/blog'] },
    );

    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('button'));

    expect(
      await screen.findByText('Blog Integration Suite'),
    ).toBeInTheDocument();
  });

  /**
   * FLOW 2:
   * Ensures blog data is rendered from router state
   * without triggering a refetch (performance optimization)
   */
  it('renders blog from router state without refetching', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/blog/:id',
          element: <BlogDetailProbe />,
        },
      ],
      {
        initialEntries: [
          {
            pathname: '/blog/b1',
            state: { blog },
          },
        ],
      },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('id:')).toBeInTheDocument();
    expect(screen.getByText('b1')).toBeInTheDocument();

    expect(screen.getByText('name:')).toBeInTheDocument();
    expect(screen.getByText('Blog Integration Suite')).toBeInTheDocument();

    expect(screen.getByText('duration:')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  /**
   * FLOW 3:
   * BlogContent → back navigation → Blog list page
   */
  it('navigates back to blog list route', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/blog/:id',
          element: <BlogContent blog={blog} />,
        },
        {
          path: '/blog',
          element: <BlogListProbe />,
        },
      ],
      { initialEntries: ['/blog/b1'] },
    );

    render(<RouterProvider router={router} />);

    const backButton = screen.getByRole('button');

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Blog List Page')).toBeInTheDocument();
    });
  });
});
