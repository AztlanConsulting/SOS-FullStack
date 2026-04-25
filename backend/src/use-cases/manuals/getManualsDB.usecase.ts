import type {
  ManualRepository,
  GetManual,
  ManualResult,
} from '@domain/repositories/manual.repository';
import { normalizeContent } from '@utils/content.mapper';

export const getManualsDB = async (
  manualRepository: ManualRepository,
  manualRequest: GetManual,
): Promise<{ manuals: ManualResult[]; totalManuals: number }> => {
  const manuals: ManualResult[] =
    await manualRepository.getManuals(manualRequest);

  const totalManuals: number =
    await manualRepository.getTotalManuals(manualRequest);

  return { manuals: manuals.map(normalizeManual), totalManuals };
};

export const getManualByIdDB = async (
  manualRepository: ManualRepository,
  id: string,
): Promise<ManualResult | null> => {
  const manual: ManualResult | null = await manualRepository.getManualById(id);

  if (!manual) return null;

  return normalizeManual(manual);
};

function normalizeManual(manual: ManualResult): ManualResult {
  const plainWorkshop =
    typeof (manual as ManualResult & { toObject?: () => ManualResult })
      .toObject === 'function'
      ? (manual as ManualResult & { toObject: () => ManualResult }).toObject()
      : manual;

  return {
    ...plainWorkshop,
    price: typeof plainWorkshop.price === 'number' ? plainWorkshop.price : 0,
    content: normalizeContent(plainWorkshop.content),
    imageUrl: plainWorkshop.imageUrl ?? '',
  };
}
