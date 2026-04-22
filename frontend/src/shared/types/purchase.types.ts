export type PurchaseRequest = {
  _id: string;
  item: string;
  price: number;
  url: string;
};

export type Plan = {
  planType: string;
  duration: string;
  distance: string;
};

export type Product = {
  _id: string;
  imageUrl: string;
  name: string;
  content: string;
  price: number;
};
