import axiosInstance from '@/shared/utils/axios';

async function deleteBlog(blogId: string) {
  const result = await axiosInstance.delete(`/blog/${blogId}`);
  return result;
}

export default deleteBlog;
