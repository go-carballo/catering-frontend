import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  role: z.enum(["ADMIN", "CATERING_MANAGER", "CLIENT_MANAGER"], {
    message: "Selecciona un rol válido",
  }),
  companyId: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  role: z.enum(["ADMIN", "CATERING_MANAGER", "CLIENT_MANAGER"]).optional(),
  companyId: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
