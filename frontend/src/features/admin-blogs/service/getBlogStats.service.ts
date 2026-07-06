import axiosInstance from '@/shared/utils/axios';

async function getBlogStats() {
  const { data } = await axiosInstance.get('/blog/stats');
  console.log(data);
  return data;
}

export default getBlogStats;
