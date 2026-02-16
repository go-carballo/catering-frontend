import { z } from "zod";
import type { WorkMode, DayOfWeek } from "@/services/clients.service";

export const createClientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  taxId: z.string().optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"], {
    message: "Selecciona un modo de trabajo",
  }),
  officeDays: z
    .array(z.number().int().min(1).max(7))
    .min(1, "Selecciona al menos un día")
    .refine(
      (days) => {
        const unique = new Set(days);
        return unique.size === days.length;
      },
      { message: "No puede haber días duplicados" }
    ),
});

export const updateClientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  taxId: z.string().optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  officeDays: z
    .array(z.number().int().min(1).max(7))
    .min(1, "Selecciona al menos un día")
    .refine(
      (days) => {
        const unique = new Set(days);
        return unique.size === days.length;
      },
      { message: "No puede haber días duplicados" }
    )
    .optional(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;

/**
 * Unified form data type for the client form dialog.
 * Create-only fields (email, password) are marked optional so the same
 * type works for both create and edit modes with react-hook-form generics.
 */
export type ClientFormData = {
  name: string;
  email?: string;
  password?: string;
  taxId?: string;
  workMode: WorkMode;
  officeDays: DayOfWeek[];
};
