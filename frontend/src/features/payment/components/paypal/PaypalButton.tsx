import { createLostPetReportRequest } from '@/features/users/services/lostPet.service';
import type { PetReportData } from '@/features/users/types/petReport.types';
import type { PurchasedPlanResponse } from '@/shared/types/pet.types';
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
import { useEffect, useRef, useState } from 'react';

interface Props {
  data: Order;
  purchaseDetail: PurchaseDetail;
  success: () => void;
}

// PaypalButton: logic to handle payment logic
// When transaction starts and order is created
// When the transaction is confirmed and finished
const PaypalButton = ({ data, purchaseDetail, success }: Props) => {
  const planIdRef = useRef<string | null>(null); // Use a ref to track the ID
  data.method = 'paypal';

  return (
    <>
      <div className="mx-auto w-full">
        <PayPalOneTimePaymentButton
          className="-z-20 w-full"
          presentationMode="auto"
          createOrder={async () => {
            console.log('Create order');

            if (data.plan) {
              const petResult: PurchasedPlanResponse =
                await createLostPetReportRequest(data.plan);

              console.log(petResult);
              console.log(data.plan);
              const newPetId = petResult.plan.petId;
              planIdRef.current = newPetId;
            }
            const response = await createPaypalPayment(data);
            const orderId = response.data.result.id;
            return { orderId };
          }}
          onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
            console.log('Approve order');
            let purchaseInfo = purchaseDetail;
            if (data.plan) {
              purchaseInfo = {
                userEmail: data.plan.email,
                productId: planIdRef.current!,
                productType: 'plan',
              };
            }
            console.log(purchaseInfo);

            const response = await confirmPaypalPayment(
              orderId,
              purchaseInfo,
              planIdRef.current,
            );
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

export default PaypalButton;
