export type PurchaseRequest = {
  _id: string;
  item: string;
  price: number;
  url: string;
};

export type Product = {
  _id: string;
  imageUrl: string;
  name: string;
  content: string;
  price: number;
};
