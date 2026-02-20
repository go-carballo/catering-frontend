import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Client {
  id: string;
  name: string;
  email: string;
  taxId: string | null;
  workMode: WorkMode;
  officeDays: DayOfWeek[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  password: string;
  taxId?: string;
  workMode: WorkMode;
  officeDays: DayOfWeek[];
}

export interface UpdateClientDto {
  name?: string;
  taxId?: string;
  workMode?: WorkMode;
  officeDays?: DayOfWeek[];
}

export const clientsService = {
  /**
   * Get all client companies
   */
  async list(): Promise<Client[]> {
    return apiGet<Client[]>("/clients");
  },

  /**
   * Get client by ID
   */
  async getById(id: string): Promise<Client> {
    return apiGet<Client>(`/clients/${id}`);
  },

  /**
   * Register a new client company (public)
   */
  async create(dto: CreateClientDto): Promise<Client> {
    return apiPost<Client>("/clients", dto);
  },

  /**
   * Update a client company
   */
  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    return apiPatch<Client>(`/clients/${id}`, dto);
  },

  /**
   * Deactivate a client company (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiDelete(`/clients/${id}`);
  },
};
