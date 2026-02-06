export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  companyId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Role display
export const roleDisplay: Record<UserRole, { label: string; color: string }> =
  {
    ADMIN: { label: "Administrador", color: "bg-red-100 text-red-800" },
    MANAGER: { label: "Gerente", color: "bg-blue-100 text-blue-800" },
    EMPLOYEE: { label: "Empleado", color: "bg-gray-100 text-gray-800" },
  };
