// File: src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { StaffEntity } from './entities/staff.entity';


@Injectable()
export class AuthService {
    private readonly staffList: StaffEntity[] = [];

    constructor(
        private readonly jwtService: JwtService
    ) {
        const filePath = path.resolve(process.cwd(), 'src', 'common', 'data', 'staffs.json');
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            this.staffList = JSON.parse(fileData);
        } catch (error) {
            console.warn('Unable to load staffs.json:', error.message);
        }
    }

    findByEmail(email: string): StaffEntity | undefined {
        return this.staffList.find((staff) => staff.email === email);
    }

    validateCredentials(email: string, password: string): StaffEntity | null {
        const staff = this.findByEmail(email);
        if (!staff) return null;
        
        if (staff.password !== password) return null;
        return staff;
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = this.validateCredentials(email, password);
        if (!user) return null;

        const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
        return this.jwtService.sign(payload);
    }

    async validateToken(token: string) {
        if (!token) return null;
        try {
            return this.jwtService.verify(token);
        } catch {
            return null;
        }
    }
}
