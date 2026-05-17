import type {
  WorkshopEmailService,
  SendWorkshopEmailDTO,
} from '@domain/ports/emailService.port';

export const sendWorkshopEmail = async (
  workshopEmailService: WorkshopEmailService,
  data: SendWorkshopEmailDTO,
): Promise<void> => {
  return await workshopEmailService.sendWorkshopEmail(data);
};
