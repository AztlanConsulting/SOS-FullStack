export type Manual = {
  _id: string;
  name: string;
  price: number;
  content: string;
  imageUrl: string;
};

export type ManualResult = {
  manuals: Manual[];
  total: number;
};
