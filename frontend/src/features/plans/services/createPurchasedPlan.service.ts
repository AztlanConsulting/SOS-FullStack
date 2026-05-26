import axiosInstance from '@shared/utils/axios';

export type CreatePurchasedPlanRequest = {
  petId: string;
  name: string;
  price: number;
  duration: number;
  radius: number;
  features: string[];
};

export const createPurchasedPlanRequest = async (
  planData: CreatePurchasedPlanRequest,
) => {
  const { data } = await axiosInstance.post(
    '/plans/createPurchasedPlan',
    planData,
  );
  return data;
};
