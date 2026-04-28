export interface RoleRepository {
  getRoleIdByName(role: string): Promise<string | null>;
}
