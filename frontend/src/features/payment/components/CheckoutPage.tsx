import {
  PayPalOneTimePaymentButton,
  type OnApproveDataOneTimePayments,
} from '@paypal/react-paypal-js/sdk-v6';
import axiosInstance from '@utils/axios';

const CheckoutPage = () => {
  return (
    <PayPalOneTimePaymentButton
      presentationMode="auto"
      createOrder={async () => {
        console.log('Create order');

        const response = await axiosInstance.post('/payments/create-order');
        console.log(response.data);
        const { orderId } = response.data;
        return { orderId };
      }}
      onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
        console.log('Approve order');
        const response = await axiosInstance.post(
          `/payments/capture-order/${orderId}`,
        );
        console.log(response.data);
        // await fetch(`http://localhost:3000/capture-order/${orderId}`, {
        //   method: 'POST',
        // });
        console.log('Payment captured!');
      }}
    />
  );
};

export default CheckoutPage;
