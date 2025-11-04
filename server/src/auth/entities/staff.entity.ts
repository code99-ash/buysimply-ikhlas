export interface StaffEntity {
    id: number;
    email: string;
    password: string;
    role: 'staff' | 'admin' | 'superadmin';
    name?: string;
}