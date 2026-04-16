import type {
  ManualRepository,
  GetManual,
  ManualResult,
} from '@domain/repositories/manual.repository';

export const getManualsDB = async (
  manualRepository: ManualRepository,
  manualRequest: GetManual,
): Promise<{ manuals: ManualResult[]; totalManuals: number }> => {
  const manuals: ManualResult[] =
    await manualRepository.getManuals(manualRequest);
  const totalManuals: number = await manualRepository.getTotalManuals();
  return { manuals, totalManuals };
};
