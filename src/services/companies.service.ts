import { apiGet } from "./api";
import type { Company } from "@/types/company";

export const companiesService = {
  /**
   * Get all companies (admin only)
   */
  async list(): Promise<Company[]> {
    return apiGet<Company[]>("/api/companies");
  },

  /**
   * Get company by ID
   */
  async getById(id: string): Promise<Company> {
    return apiGet<Company>(`/api/companies/${id}`);
  },

  /**
   * Get caterings
   */
  async getCaterings(): Promise<Company[]> {
    return apiGet<Company[]>("/api/caterings");
  },

  /**
   * Get clients
   */
  async getClients(): Promise<Company[]> {
    return apiGet<Company[]>("/api/clients");
  },
};
