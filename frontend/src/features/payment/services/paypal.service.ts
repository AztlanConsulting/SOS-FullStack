import axiosInstance from '@shared/utils/axios';
import type { Order, PurchaseDetail } from '../types/payment.types';

// Confirm payment with order detail, and register transaction with userMain
export async function confirmPaypalPayment(
  orderId: string,
  purchaseDetails: PurchaseDetail,
  planId: string | null,
  extensionPlan?: unknown,
) {
  return await axiosInstance.post(`/payments/capture-order/${orderId}`, {
    planId,
    purchaseDetails,
    extensionPlan,
  });
}
export async function createPaypalPayment(data: Order, exchangeRate: number) {
  const dataToSend = { ...data };
  dataToSend.amount = Math.round(dataToSend.amount / exchangeRate);
  dataToSend.currency = 'USD';
  return await axiosInstance.post('/payments/create-order', dataToSend);
}
