import { PayPalProvider } from '@paypal/react-paypal-js/sdk-v6';
import PaypalButton from './PaypalButton';

const Paypal = () => {
  return (
    <>
      <PayPalProvider
        clientId={import.meta.env.VITE_PAYPAL_CLIENT}
        components={['paypal-payments']}
        pageType="checkout"
      >
        <PaypalButton />
      </PayPalProvider>
    </>
  );
};

export default Paypal;
