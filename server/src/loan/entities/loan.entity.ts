export interface ILoanApplicantPublic {
    name: string,
    email: string,
    telephone: string,
}

export interface ILoanApplicant extends ILoanApplicantPublic {
    totalLoan: string
}

export type LoanStatus = "active" | "pending";

export interface ILoanEntity {
    id: string,
    amount: string,
    maturityDate: string,
    status: LoanStatus,
    applicant: ILoanApplicant,
    createdAt: string
}

export interface ILoanEntityPublic {
    id: string,
    amount: string,
    maturityDate: string,
    status: LoanStatus,
    applicant: ILoanApplicantPublic,
    createdAt: string
}
