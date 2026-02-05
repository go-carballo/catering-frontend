import { useQuery } from "@tanstack/react-query";
import { contractsService } from "@/services/contracts.service";

export const financeMetricsKeys = {
  all: ["finance-metrics"] as const,
};

export function useFinanceMetrics() {
  return useQuery({
    queryKey: financeMetricsKeys.all,
    queryFn: () => contractsService.getFinanceMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true,
  });
}
