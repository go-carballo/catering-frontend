import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  serviceDaysService,
  ServiceDaysQuery,
} from "@/services/service-days.service";
import { toast } from "sonner";
import type { ConfirmExpectedDto, ConfirmServedDto } from "@/types/service-day";

export const serviceDayKeys = {
  all: ["serviceDays"] as const,
  list: (contractId: string, query?: ServiceDaysQuery) =>
    [...serviceDayKeys.all, "list", contractId, query] as const,
};

export function useServiceDays(contractId: string, query?: ServiceDaysQuery) {
  return useQuery({
    queryKey: serviceDayKeys.list(contractId, query),
    queryFn: () => serviceDaysService.list(contractId, query),
    enabled: !!contractId,
  });
}

interface ConfirmExpectedParams {
  contractId: string;
  serviceDayId: string;
  dto: ConfirmExpectedDto;
}

export function useConfirmExpected(
  contractId: string,
  query?: ServiceDaysQuery,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, serviceDayId, dto }: ConfirmExpectedParams) =>
      serviceDaysService.confirmExpected(contractId, serviceDayId, dto),
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
  contractId: string;
  serviceDayId: string;
  dto: ConfirmServedDto;
}

export function useConfirmServed(contractId: string, query?: ServiceDaysQuery) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, serviceDayId, dto }: ConfirmServedParams) =>
      serviceDaysService.confirmServed(contractId, serviceDayId, dto),
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
