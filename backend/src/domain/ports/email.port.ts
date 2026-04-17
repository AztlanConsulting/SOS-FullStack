export interface emailPort {
    sendCredentials(email: string, petName: string): Promise<void>;
}