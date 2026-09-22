export type Role = 'employee' | 'coordinator' | 'sector_manager' | 'admin';

export interface AuthUser {
    userAccountId: number;
    email: string;
    roles: Role[];
}