export type BlogContentBlock = {
  content: string;
  type: string;
};

export type Blog = {
  _id: string;
  name: string;
  duration: number;
  content: BlogContentBlock[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogResult = {
  blogs: Blog[];
  total: number;
};
