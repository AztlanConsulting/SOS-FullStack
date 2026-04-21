export interface PaymentMethod {
  method: string;
  icons: string[];
  description?: string;
  element: React.ReactNode;
}
