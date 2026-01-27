import { apiGet, api } from "./api";
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
      `/api/contracts/${contractId}/reports/weekly?weekStart=${weekStart}`,
    );
  },

  /**
   * Download CSV report
   * Returns blob URL for download
   */
  async downloadWeeklyCsv(
    contractId: string,
    weekStart: string,
  ): Promise<string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const url = `${env.API_URL}/api/contracts/${contractId}/reports/weekly/csv?weekStart=${weekStart}`;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
};
