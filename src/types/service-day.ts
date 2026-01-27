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
  quantity: number;
}

export interface ConfirmServedDto {
  quantity: number;
}

// Status display
export const serviceDayStatusDisplay: Record<
  ServiceDayStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmado", color: "bg-green-100 text-green-800" },
};
