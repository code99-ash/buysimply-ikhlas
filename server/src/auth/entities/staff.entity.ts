export type StaffRole = 'staff' | 'admin' | 'superAdmin';

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