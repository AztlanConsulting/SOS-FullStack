import { PayPalProvider } from '@paypal/react-paypal-js/sdk-v6';
import CheckoutPage from '../features/payment/components/CheckoutPage';

const Paypal = () => {
  return (
    <PayPalProvider
      clientId={import.meta.env.VITE_PAYPAL_CLIENT}
      components={['paypal-payments']}
      pageType="checkout"
    >
      <CheckoutPage />
    </PayPalProvider>
  );
};

export default Paypal;
