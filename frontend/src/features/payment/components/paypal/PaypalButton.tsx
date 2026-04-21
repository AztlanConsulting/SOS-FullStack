import {
  PayPalOneTimePaymentButton,
  type OnApproveDataOneTimePayments,
} from '@paypal/react-paypal-js/sdk-v6';
import axiosInstance from '@shared/utils/axios';

const CheckoutPage = () => {
  return (
    <>
      <PayPalOneTimePaymentButton
        presentationMode="auto"
        createOrder={async () => {
          console.log('Create order');

          const response = await axiosInstance.post('/payments/payment-intent');
          // console.log(response.data);
          const { orderId } = response.data;
          return { orderId };
        }}
        onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
          console.log('Approve order');
          const response = await axiosInstance.get(
            `/payments/capture-order/${orderId}`,
          );
          console.log(response.data);

          console.log('Payment captured!');
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    </>
  );
};

export default CheckoutPage;
