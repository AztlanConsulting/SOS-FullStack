import type {
  PaymentIntentDTO,
  PaymentIntentResult,
  PaymentProvider,
} from './paymentProvider.port';

export interface PaypalAccessToken {
  accessToken: string | null;
  error: string | null;
}

export interface DetailOrder {
  intent: string;
  purchase_units: {
    items: {
      name: string;
      description: string;
      quantity: string;
      unit_amount: {
        currency_code: string;
        value: number;
      };
    }[];
    amount: {
      currency_code: string;
      value: number;
      breakdown: {
        item_total: {
          currency_code: string;
          value: number;
        };
      };
    };
  }[];
  payment_source: {
    paypal: {
      experience_context: {
        payment_method_preference: string;
        payment_method_selected: string;
        brand_name: string;
        shipping_preference: string;
        locale: string;
        user_action: string;
        return_url: string;
        cancel_url: string;
      };
    };
  };
}

export interface PaymentOrderId {
  orderId: string | null;
  error: string | null;
}

export interface PaymentSuccess {
  id?: string;
  error?: string;
}

export interface PaypalApi {
  getAccessToken(): Promise<PaypalAccessToken>;
  createOrder(
    data: PaymentIntentDTO,
    detailOrder: DetailOrder,
  ): Promise<PaymentIntentResult>;
  completeOrder(orderId: string): Promise<PaymentSuccess>;
}
