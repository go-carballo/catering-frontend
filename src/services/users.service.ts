import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

export type UserRole = "ADMIN" | "CATERING_MANAGER" | "CLIENT_MANAGER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyId?: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: UserRole;
  companyId?: string;
}

export const usersService = {
  /**
   * Get all users
   */
  async list(): Promise<User[]> {
    return apiGet<User[]>("/users");
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    return apiGet<User>(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  async create(dto: CreateUserDto): Promise<User> {
    return apiPost<User>("/users", dto);
  },

  /**
   * Update a user
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return apiPatch<User>(`/users/${id}`, dto);
  },

  /**
   * Deactivate a user (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiDelete(`/users/${id}`);
  },
};
