import { PayPalProvider } from '@paypal/react-paypal-js/sdk-v6';
import PaypalButton from './PaypalButton';
import type { Order, PurchaseDetail } from '../../types/payment.types';

interface Props {
  data: Order;
  purchaseDetail: PurchaseDetail;
  success: () => void;
}

/*
* Paypal button
  @params data: Order details as price, currency, object, etc
  @params: purchaseDetail: Information of transaction and user
*/
const Paypal = ({ data, purchaseDetail, success }: Props) => {
  return (
    <>
      <PayPalProvider
        clientId={import.meta.env.VITE_PAYPAL_CLIENT}
        components={['paypal-payments']}
        pageType="checkout"
      >
        <PaypalButton
          data={data}
          purchaseDetail={purchaseDetail}
          success={success}
        />
      </PayPalProvider>
    </>
  );
};

export default Paypal;
