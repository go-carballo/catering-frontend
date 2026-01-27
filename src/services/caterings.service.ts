import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

export interface Catering {
  id: string;
  name: string;
  email: string;
  taxId: string | null;
  dailyCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCateringDto {
  name: string;
  email: string;
  password: string;
  taxId?: string;
  dailyCapacity: number;
}

export interface UpdateCateringDto {
  name?: string;
  taxId?: string;
  dailyCapacity?: number;
}

export const cateringsService = {
  /**
   * Get all catering companies
   */
  async list(): Promise<Catering[]> {
    return apiGet<Catering[]>("/caterings");
  },

  /**
   * Get catering by ID
   */
  async getById(id: string): Promise<Catering> {
    return apiGet<Catering>(`/caterings/${id}`);
  },

  /**
   * Register a new catering company (public)
   */
  async create(dto: CreateCateringDto): Promise<Catering> {
    return apiPost<Catering>("/caterings", dto);
  },

  /**
   * Update a catering company
   */
  async update(id: string, dto: UpdateCateringDto): Promise<Catering> {
    return apiPatch<Catering>(`/caterings/${id}`, dto);
  },

  /**
   * Deactivate a catering company (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiDelete(`/caterings/${id}`);
  },
};
