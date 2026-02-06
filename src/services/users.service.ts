import { apiGet, apiPost, apiPatch, apiDelete } from "./api";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/users";

export type { User, CreateUserDto, UpdateUserDto };

export const usersService = {
  /**
   * Get all users for current company
   */
  async list(): Promise<User[]> {
    return apiGet<User[]>("/users");
  },

  /**
   * Get single user by ID
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
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    return apiDelete(`/users/${id}`);
  },
};
