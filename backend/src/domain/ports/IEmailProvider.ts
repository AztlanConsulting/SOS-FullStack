export interface IEmailProvider {
    sendCredentials(email: string, petName: string): Promise<void>;
}