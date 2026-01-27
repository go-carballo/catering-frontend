import { apiGet, apiPost } from "./api";
import type { Contract } from "@/types/contract";

export const contractsService = {
  /**
   * Get all contracts for current user's company
   */
  async list(): Promise<Contract[]> {
    return apiGet<Contract[]>("/api/contracts");
  },

  /**
   * Get single contract by ID
   */
  async getById(id: string): Promise<Contract> {
    return apiGet<Contract>(`/api/contracts/${id}`);
  },

  /**
   * Pause a contract (client only)
   */
  async pause(id: string): Promise<Contract> {
    return apiPost<Contract>(`/api/contracts/${id}/pause`, {});
  },

  /**
   * Resume a contract (client only)
   */
  async resume(id: string): Promise<Contract> {
    return apiPost<Contract>(`/api/contracts/${id}/resume`, {});
  },

  /**
   * Terminate a contract (client only)
   */
  async terminate(id: string): Promise<Contract> {
    return apiPost<Contract>(`/api/contracts/${id}/terminate`, {});
  },
};
