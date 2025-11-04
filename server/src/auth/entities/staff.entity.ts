export type StaffRole = 'staff' | 'admin' | 'superadmin';

export interface IStaffEntity {
    id: number;
    email: string;
    password: string;
    role: StaffRole;
    name?: string;
}

export interface IJwtStaffPayload {
    id: number;
    email: string;
    role: StaffRole;
    name?: string;
}