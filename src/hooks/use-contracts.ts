import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractsService } from "@/services/contracts.service";
import type { CreateContractDto } from "@/types/contract";
import { toast } from "sonner";

export const contractKeys = {
  all: ["contracts"] as const,
  list: () => [...contractKeys.all, "list"] as const,
  detail: (id: string) => [...contractKeys.all, "detail", id] as const,
};

export function useContracts() {
  return useQuery({
    queryKey: contractKeys.list(),
    queryFn: () => contractsService.list(),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractsService.getById(id),
    enabled: !!id,
  });
}

export function usePauseContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsService.pause(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
      queryClient.setQueryData(contractKeys.detail(data.id), data);
      toast.success("Contrato pausado");
    },
    onError: () => {
      toast.error("Error al pausar el contrato");
    },
  });
}

export function useResumeContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsService.resume(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
      queryClient.setQueryData(contractKeys.detail(data.id), data);
      toast.success("Contrato reactivado");
    },
    onError: () => {
      toast.error("Error al reactivar el contrato");
    },
  });
}

export function useTerminateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsService.terminate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
      queryClient.setQueryData(contractKeys.detail(data.id), data);
      toast.success("Contrato terminado");
    },
    onError: () => {
      toast.error("Error al terminar el contrato");
    },
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateContractDto) => contractsService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
      queryClient.setQueryData(contractKeys.detail(data.id), data);
      toast.success("Contrato creado exitosamente");
    },
    onError: (error: any) => {
      // Extract backend error message if available
      const message = error?.data?.message || error?.message || "Error desconocido";
      toast.error(`Error al crear el contrato: ${message}`);
      console.error("Create contract error:", error);
    },
  });
}
