import { apiGet } from "./api";
import { authService } from "./auth.service";
import { env } from "@/config/env";

export interface WeeklyReportEntry {
  date: string;
  dayOfWeek: string;
  expectedQuantity: number | null;
  servedQuantity: number | null;
  status: "PENDING" | "CONFIRMED";
  difference: number | null;
}

export interface WeeklyReport {
  contractId: string;
  weekStart: string;
  weekEnd: string;
  entries: WeeklyReportEntry[];
  totals: {
    totalExpected: number;
    totalServed: number;
    totalDifference: number;
  };
}

export const reportsService = {
  /**
   * Get weekly report for a contract
   */
  async getWeeklyReport(
    contractId: string,
    weekStart: string,
  ): Promise<WeeklyReport> {
    return apiGet<WeeklyReport>(
      `/contracts/${contractId}/reports/weekly?weekStart=${weekStart}`,
    );
  },

  /**
   * Download CSV report.
   *
   * NOTE: This uses raw fetch because we need the response as a Blob,
   * not JSON. But we still use authService for token access to avoid
   * duplicating token retrieval logic.
   */
  async downloadWeeklyCsv(
    contractId: string,
    weekStart: string,
  ): Promise<string> {
    const token = authService.getStoredToken();
    const url = `${env.API_URL}/contracts/${contractId}/reports/weekly/csv?weekStart=${weekStart}`;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      // If 401, try refreshing and retry once
      if (response.status === 401) {
        const newToken = await authService.refreshToken();
        if (newToken) {
          const retryResponse = await fetch(url, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          if (!retryResponse.ok) {
            throw new Error("Failed to download report");
          }
          const blob = await retryResponse.blob();
          return URL.createObjectURL(blob);
        }
      }
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
};
