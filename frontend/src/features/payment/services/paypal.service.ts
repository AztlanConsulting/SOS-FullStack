import axiosInstance from '@shared/utils/axios';
import type { Order, PurchaseDetail } from '../types/payment.types';

// Confirm payment with order detail, and register transaction with userMain
export async function confirmPaypalPayment(orderId: string) {
  return await axiosInstance.post(`/payments/capture-order/${orderId}`);
}
export async function createPaypalPayment(data: Order) {
  return await axiosInstance.post('/payments/create-order', { ...data });
}
