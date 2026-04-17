export interface userRepository {
    save(client: any): Promise<void>;
    findByEmail(email: string): Promise<any>;
}