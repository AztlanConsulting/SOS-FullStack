export type PurchaseRequest = {
  _id: string;
  item: string;
  price: number;
  url: string;
};

export type Product = {
  imageUrl: string;
  name: string;
  content: string;
  price: number;
};
