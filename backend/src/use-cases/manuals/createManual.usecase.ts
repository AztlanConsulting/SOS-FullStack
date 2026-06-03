import type {
  ManualRepository,
  CreateManualInput,
} from '@domain/repositories/manual.repository';

export const createManual = async (
  manualImpl: ManualRepository,
  manual: CreateManualInput,
) => {
  const response = await manualImpl.createManual(manual);
  if (response.error !== null) throw Error(response.error);
  return response.manualId;
};
