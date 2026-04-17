export interface IClientRepository {
    save(client: any): Promise<void>;
    findByEmail(email: string): Promise<any>;
}