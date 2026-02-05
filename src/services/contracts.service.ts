import { apiGet, apiPost } from "./api";
import type { Contract, CreateContractDto } from "@/types/contract";
import type { FinanceMetrics } from "@/types/finance-metrics";

export const contractsService = {
  /**
   * Get all contracts for current user's company
   */
  async list(): Promise<Contract[]> {
    return apiGet<Contract[]>("/contracts");
  },

  /**
   * Get single contract by ID
   */
  async getById(id: string): Promise<Contract> {
    return apiGet<Contract>(`/contracts/${id}`);
  },

  /**
   * Create a new contract
   */
  async create(dto: CreateContractDto): Promise<Contract> {
    return apiPost<Contract>("/contracts", dto);
  },

  /**
   * Pause a contract (client only)
   */
  async pause(id: string): Promise<Contract> {
    return apiPost<Contract>(`/contracts/${id}/pause`, {});
  },

  /**
   * Resume a contract (client only)
   */
  async resume(id: string): Promise<Contract> {
    return apiPost<Contract>(`/contracts/${id}/resume`, {});
  },

  /**
   * Terminate a contract (client only)
   */
  async terminate(id: string): Promise<Contract> {
    return apiPost<Contract>(`/contracts/${id}/terminate`, {});
  },

  /**
   * Get finance metrics (client only)
   */
  async getFinanceMetrics(): Promise<FinanceMetrics> {
    return apiGet<FinanceMetrics>("/contracts/finance-metrics");
  },
};
