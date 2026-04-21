export type Blog = {
  _id: string;
  name: string;
  price: number;
  content: string;
  imageUrl: string;
};

export type BlogResult = {
  blogs: Blog[];
  total: number;
};
