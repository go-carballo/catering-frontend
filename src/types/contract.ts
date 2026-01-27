export type ContractStatus = "ACTIVE" | "PAUSED" | "TERMINATED";
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Contract {
  id: string;
  cateringCompanyId: string;
  clientCompanyId: string;
  startDate: string;
  endDate: string | null;
  pricePerService: number;
  flexibleQuantity: boolean;
  minDailyQuantity: number;
  maxDailyQuantity: number;
  noticePeriodHours: number;
  serviceDays: DayOfWeek[];
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
  // Optional: populated by frontend with company data
  cateringName?: string;
  clientName?: string;
}

export interface CreateContractDto {
  cateringCompanyId: string;
  clientCompanyId: string;
  startDate?: string;
  endDate?: string;
  pricePerService: number;
  flexibleQuantity?: boolean;
  minDailyQuantity: number;
  maxDailyQuantity: number;
  noticePeriodHours: number;
  serviceDays: DayOfWeek[];
}

// Helper to get day name
export const dayNames: Record<DayOfWeek, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

// Status display
export const statusDisplay: Record<
  ContractStatus,
  { label: string; color: string }
> = {
  ACTIVE: { label: "Activo", color: "bg-green-100 text-green-800" },
  PAUSED: { label: "Pausado", color: "bg-yellow-100 text-yellow-800" },
  TERMINATED: { label: "Terminado", color: "bg-red-100 text-red-800" },
};
