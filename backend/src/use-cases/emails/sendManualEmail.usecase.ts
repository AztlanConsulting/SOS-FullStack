import type {
  ManualEmailService,
  SendManualEmailDTO,
} from '@domain/ports/emailService.port';

export const sendManualEmail = async (
  manualEmailService: ManualEmailService,
  data: SendManualEmailDTO,
): Promise<void> => {
  return await manualEmailService.sendManualEmail(data);
};
