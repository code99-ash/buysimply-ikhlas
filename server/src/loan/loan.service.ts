import { type IJwtStaffPayload } from 'src/auth/entities/staff.entity';
import { Injectable } from '@nestjs/common';
import { ILoanEntity, ILoanEntityPublic, LoanStatus } from './entities/loan.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoanService {
    private loanLists: ILoanEntity[] = [];

    constructor() {
        const filePath = path.resolve(process.cwd(), 'src', 'common', 'data', 'loans.json');
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            this.loanLists = JSON.parse(fileData);
        } catch (error) {
            console.warn('Unable to load loans.json:', error.message);
        }
    }

    private hideTotalLoan(loan: ILoanEntity): ILoanEntityPublic {
        const { applicant: { totalLoan, ...a }, ...rest } = loan;
        return { ...rest, applicant: a };
    }

    getAllLoans(user: IJwtStaffPayload, status?: LoanStatus): ILoanEntity[] | ILoanEntityPublic[] {
        const statuses: LoanStatus[] = status? [status] : ["pending", "active"] 

        const loans = this.loanLists.filter((loan) => (statuses.includes(loan.status)));
        
        if(user.role === 'staff') {
            return loans.filter((loan) => loan.applicant.email === user.email)
                        .map((loan) => this.hideTotalLoan(loan));
        }

        return loans;
    }

    getLoansByApplicantEmail(user: IJwtStaffPayload, email: string): ILoanEntity[] | ILoanEntityPublic[] {
        const loans = this.loanLists.filter((loan) => loan.applicant.email === email);
        return user.role === 'staff' ? loans.map((loan) => this.hideTotalLoan(loan)) : loans;
    }

    getExpiredLoans(user: IJwtStaffPayload): ILoanEntity[] | ILoanEntityPublic[] {
        const loans = this.loanLists.filter((loan) => {
            const maturityDate = new Date(loan.maturityDate);
            const currentDate = new Date();
            return maturityDate < currentDate;
        });
        return user.role === 'staff' ? loans.map((loan) => this.hideTotalLoan(loan)) : loans;
    }

    deleteLoanById(id: string): boolean {
        const loans = this.loanLists.filter((loan) => loan.id !== id);

        if (loans.length === this.loanLists.length) { // Nothing was deleted
            return false;
        }

        this.loanLists = loans
        return true;
    }
    
    getLoanById(id: string): ILoanEntity | undefined {
        return this.loanLists.find((loan) => loan.id === id);
    }
}
