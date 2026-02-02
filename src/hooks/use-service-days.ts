import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  serviceDaysService,
  ServiceDaysQuery,
  formatDateParam,
} from "@/services/service-days.service";
import { toast } from "sonner";
import type { ConfirmExpectedDto, ConfirmServedDto, ServiceDay } from "@/types/service-day";
import type { Contract } from "@/types/contract";

export const serviceDayKeys = {
  all: ["serviceDays"] as const,
  list: (contractId: string, query?: ServiceDaysQuery) =>
    [...serviceDayKeys.all, "list", contractId, query] as const,
};

export function useServiceDays(contractId: string, query: ServiceDaysQuery) {
  return useQuery({
    queryKey: serviceDayKeys.list(contractId, query),
    queryFn: () => serviceDaysService.list(contractId, query),
    enabled: !!contractId && !!query.from && !!query.to,
  });
}

interface ConfirmExpectedParams {
  serviceDayId: string;
  dto: ConfirmExpectedDto;
}

export function useConfirmExpected(
  contractId: string,
  query?: ServiceDaysQuery,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceDayId, dto }: ConfirmExpectedParams) =>
      serviceDaysService.confirmExpected(serviceDayId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceDayKeys.list(contractId, query),
      });
      toast.success("Cantidad esperada confirmada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al confirmar cantidad");
    },
  });
}

interface ConfirmServedParams {
  serviceDayId: string;
  dto: ConfirmServedDto;
}

export function useConfirmServed(contractId: string, query?: ServiceDaysQuery) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceDayId, dto }: ConfirmServedParams) =>
      serviceDaysService.confirmServed(serviceDayId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceDayKeys.list(contractId, query),
      });
      toast.success("Cantidad servida confirmada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al confirmar cantidad");
    },
  });
}

/**
 * Hook to fetch today's service days across all active contracts
 * This is useful for dashboard views
 */
export function useTodayServiceDays(contracts: Contract[] | undefined) {
  const today = formatDateParam(new Date());
  const query: ServiceDaysQuery = { from: today, to: today };

  return useQuery({
    queryKey: ["serviceDays", "today", today],
    queryFn: async () => {
      if (!contracts || contracts.length === 0) return [];

      // Only fetch for active contracts
      const activeContracts = contracts.filter((c) => c.status === "ACTIVE");

      // Fetch all service days in parallel
      const results = await Promise.allSettled(
        activeContracts.map((contract) =>
          serviceDaysService.list(contract.id, query),
        ),
      );

      // Flatten and filter successful results
      const allServiceDays: ServiceDay[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allServiceDays.push(...result.value);
        }
      });

      return allServiceDays;
    },
    enabled: !!contracts && contracts.length > 0,
    staleTime: 1000 * 60, // Cache for 1 minute
  });
}

/**
 * Hook to fetch service days for multiple contracts with flexible date range
 * Used for consolidated views with filters
 */
export function useAllServiceDays(
  contracts: Contract[] | undefined,
  query: ServiceDaysQuery,
  selectedContractIds?: string[],
) {
  return useQuery({
    queryKey: ["serviceDays", "all", query, selectedContractIds],
    queryFn: async () => {
      if (!contracts || contracts.length === 0) return [];

      // Filter contracts based on selection
      let targetContracts = contracts;
      if (selectedContractIds && selectedContractIds.length > 0) {
        targetContracts = contracts.filter((c) =>
          selectedContractIds.includes(c.id),
        );
      }

      // Fetch all service days in parallel
      const results = await Promise.allSettled(
        targetContracts.map((contract) =>
          serviceDaysService.list(contract.id, query),
        ),
      );

      // Flatten and filter successful results
      const allServiceDays: ServiceDay[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allServiceDays.push(...result.value);
        }
      });

      return allServiceDays;
    },
    enabled:
      !!contracts &&
      contracts.length > 0 &&
      !!query.from &&
      !!query.to,
    staleTime: 1000 * 30, // Cache for 30 seconds
  });
}
