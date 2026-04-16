export type Workshop = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string[];
  image: Buffer;
  imgUrl: string;
};

export type WorkshopResult = {
  workshops: Workshop[];
  total: number;
};
