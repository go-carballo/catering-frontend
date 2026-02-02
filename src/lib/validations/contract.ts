import { z } from "zod";
import type { DayOfWeek } from "@/types/contract";

export const createContractSchema = z.object({
  cateringCompanyId: z.string().min(1, "Selecciona una empresa de catering"),
  clientCompanyId: z.string().min(1, "Selecciona una empresa cliente"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pricePerService: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .multipleOf(0.01, "El precio debe tener máximo 2 decimales"),
  flexibleQuantity: z.boolean().optional().default(true),
  minDailyQuantity: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  maxDailyQuantity: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  noticePeriodHours: z
    .number()
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 hora")
    .max(168, "Máximo 7 días (168 horas)"),
  serviceDays: z
    .array(z.number().int().min(1).max(7))
    .min(1, "Selecciona al menos un día de servicio")
    .refine(
      (days) => {
        const unique = new Set(days);
        return unique.size === days.length;
      },
      { message: "No puede haber días duplicados" }
    ),
}).refine(
  (data) => data.maxDailyQuantity >= data.minDailyQuantity,
  {
    message: "La cantidad máxima debe ser mayor o igual a la mínima",
    path: ["maxDailyQuantity"],
  }
).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  }
);

// Type for form input (before validation)
export type CreateContractFormData = z.input<typeof createContractSchema>;

// Type for validated output (after validation)
export type CreateContractOutput = z.output<typeof createContractSchema>;
