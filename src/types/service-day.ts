export type ServiceDayStatus = "PENDING" | "CONFIRMED";

export interface ServiceDay {
  id: string;
  contractId: string;
  serviceDate: string;
  expectedQuantity: number | null;
  servedQuantity: number | null;
  expectedConfirmedAt: string | null;
  servedConfirmedAt: string | null;
  status: ServiceDayStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmExpectedDto {
  expectedQuantity: number;
}

export interface ConfirmServedDto {
  servedQuantity: number;
}

export interface GenerateServiceDaysDto {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
}

// Status display
export const serviceDayStatusDisplay: Record<
  ServiceDayStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmado", color: "bg-green-100 text-green-800" },
};
