import { z } from "zod";

export const createCateringSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  taxId: z.string().optional(),
  dailyCapacity: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
});

export const updateCateringSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  taxId: z.string().optional(),
  dailyCapacity: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0")
    .optional(),
});

export type CreateCateringFormData = z.infer<typeof createCateringSchema>;
export type UpdateCateringFormData = z.infer<typeof updateCateringSchema>;
