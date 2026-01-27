import { apiGet, apiPost } from "./api";
import type {
  ServiceDay,
  ConfirmExpectedDto,
  ConfirmServedDto,
} from "@/types/service-day";

export interface ServiceDaysQuery {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export const serviceDaysService = {
  /**
   * Get service days for a contract within date range
   */
  async list(
    contractId: string,
    query?: ServiceDaysQuery,
  ): Promise<ServiceDay[]> {
    const params = new URLSearchParams();
    if (query?.from) params.set("from", query.from);
    if (query?.to) params.set("to", query.to);

    const queryString = params.toString();
    const url = `/api/contracts/${contractId}/service-days${queryString ? `?${queryString}` : ""}`;

    return apiGet<ServiceDay[]>(url);
  },

  /**
   * Confirm expected quantity (client only)
   */
  async confirmExpected(
    contractId: string,
    serviceDayId: string,
    dto: ConfirmExpectedDto,
  ): Promise<ServiceDay> {
    return apiPost<ServiceDay>(
      `/api/contracts/${contractId}/service-days/${serviceDayId}/confirm-expected`,
      dto,
    );
  },

  /**
   * Confirm served quantity (catering only)
   */
  async confirmServed(
    contractId: string,
    serviceDayId: string,
    dto: ConfirmServedDto,
  ): Promise<ServiceDay> {
    return apiPost<ServiceDay>(
      `/api/contracts/${contractId}/service-days/${serviceDayId}/confirm-served`,
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
