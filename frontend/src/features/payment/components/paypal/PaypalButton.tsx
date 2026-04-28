import { createLostPetReportRequest } from '@/features/users/services/lostPet.service';
import type { PetReportData } from '@/features/users/types/petReport.types';
import {
  createPaypalPayment,
  confirmPaypalPayment,
} from '@features/payment/services/paypal.service';
import type {
  Order,
  PurchaseDetail,
} from '@features/payment/types/payment.types';
import {
  PayPalOneTimePaymentButton,
  type OnApproveDataOneTimePayments,
} from '@paypal/react-paypal-js/sdk-v6';

interface Props {
  data: Order;
  purchaseDetail: PurchaseDetail;
  success: () => void;
}

// CheckoutPage: logic to handle payment logic
// When transaction starts and order is created
// When the transaction is confirmed and finished
const CheckoutPage = ({ data, purchaseDetail, success }: Props) => {
  data.method = 'paypal';

  return (
    <>
      <div className="mx-auto w-full">
        <PayPalOneTimePaymentButton
          className="-z-20"
          presentationMode="auto"
          createOrder={async () => {
            console.log('Create order');

            const response = await createPaypalPayment(data);
            if (data.plan) {
              const petResult = await createLostPetReportRequest(data.plan);
              console.log(petResult);
            }
            const orderId = response.data.result.id;
            return { orderId };
          }}
          onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
            console.log('Approve order');
            const response = await confirmPaypalPayment(orderId);
            if (response.status == 200) {
              console.log('Payment captured!');
              success();
            }
          }}
          onError={(error) => {
            console.log(error);
          }}
        />
      </div>
    </>
  );
};

export default CheckoutPage;
