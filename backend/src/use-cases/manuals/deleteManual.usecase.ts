import type { ManualRepository } from '@domain/repositories/manual.repository';

export async function deleteManual(
  manualImpl: ManualRepository,
  id: string,
): Promise<boolean> {
  return await manualImpl.deleteManual(id);
}
