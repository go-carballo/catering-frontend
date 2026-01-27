import { apiGet, apiPost } from "./api";
import type {
  ServiceDay,
  ConfirmExpectedDto,
  ConfirmServedDto,
  GenerateServiceDaysDto,
} from "@/types/service-day";

export interface ServiceDaysQuery {
  from: string; // YYYY-MM-DD (required)
  to: string; // YYYY-MM-DD (required)
}

export const serviceDaysService = {
  /**
   * Get service days for a contract within date range
   */
  async list(
    contractId: string,
    query: ServiceDaysQuery,
  ): Promise<ServiceDay[]> {
    const params = new URLSearchParams();
    params.set("from", query.from);
    params.set("to", query.to);

    return apiGet<ServiceDay[]>(
      `/contracts/${contractId}/service-days?${params.toString()}`,
    );
  },

  /**
   * Generate service days for a contract
   */
  async generate(
    contractId: string,
    dto: GenerateServiceDaysDto,
  ): Promise<ServiceDay[]> {
    return apiPost<ServiceDay[]>(
      `/contracts/${contractId}/service-days/generate`,
      dto,
    );
  },

  /**
   * Confirm expected quantity (client only)
   * Note: endpoint is /service-days/:id, not nested under contracts
   */
  async confirmExpected(
    serviceDayId: string,
    dto: ConfirmExpectedDto,
  ): Promise<ServiceDay> {
    return apiPost<ServiceDay>(
      `/service-days/${serviceDayId}/confirm-expected`,
      dto,
    );
  },

  /**
   * Confirm served quantity (catering only)
   * Note: endpoint is /service-days/:id, not nested under contracts
   */
  async confirmServed(
    serviceDayId: string,
    dto: ConfirmServedDto,
  ): Promise<ServiceDay> {
    return apiPost<ServiceDay>(
      `/service-days/${serviceDayId}/confirm-served`,
      dto,
    );
  },
};

// ============ Date Helpers ============

/**
 * Get Monday of current week (UTC)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get Sunday of current week (UTC)
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const monday = getWeekStart(date);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);
  return sunday;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateParam(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get current week range as query params
 */
export function getCurrentWeekRange(): ServiceDaysQuery {
  return {
    from: formatDateParam(getWeekStart()),
    to: formatDateParam(getWeekEnd()),
  };
}

/**
 * Navigate to previous/next week
 */
export function getWeekRange(
  weekOffset: number,
  baseDate: Date = new Date(),
): ServiceDaysQuery {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + weekOffset * 7);
  return {
    from: formatDateParam(getWeekStart(date)),
    to: formatDateParam(getWeekEnd(date)),
  };
}
