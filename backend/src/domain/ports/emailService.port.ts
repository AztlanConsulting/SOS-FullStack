export interface SendActivatePlanEmailDTO {
  to: string;
  username: string;
  password: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface EmailService {
  sendActivatePlanEmail(data: SendActivatePlanEmailDTO): Promise<void>;
}
