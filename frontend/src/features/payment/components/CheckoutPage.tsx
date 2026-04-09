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
        const response = await fetch('http://localhost:3000/create-order', {
          method: 'POST',
        });
        const { orderId } = await response.json();
        return { orderId };
      }}
      onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
        console.log('Approve order');
        await fetch(`http://localhost:3000/capture-order/${orderId}`, {
          method: 'POST',
        });
        console.log('Payment captured!');
      }}
    />
  );
};

export default CheckoutPage;
