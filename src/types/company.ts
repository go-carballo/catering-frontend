export type CompanyType = "CATERING" | "CLIENT";
export type CompanyStatus = "ACTIVE" | "INACTIVE";

export interface Company {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  companyType: CompanyType;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}
