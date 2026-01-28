import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cateringsService, type CreateCateringDto, type UpdateCateringDto } from "@/services/caterings.service";
import { toast } from "sonner";

export const cateringKeys = {
  all: ["caterings"] as const,
  list: () => [...cateringKeys.all, "list"] as const,
  detail: (id: string) => [...cateringKeys.all, "detail", id] as const,
};

export function useCaterings() {
  return useQuery({
    queryKey: cateringKeys.list(),
    queryFn: () => cateringsService.list(),
  });
}

export function useCatering(id: string) {
  return useQuery({
    queryKey: cateringKeys.detail(id),
    queryFn: () => cateringsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCatering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCateringDto) => cateringsService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cateringKeys.list() });
      queryClient.setQueryData(cateringKeys.detail(data.id), data);
      toast.success("Catering creado exitosamente");
    },
    onError: (error: any) => {
      const message = error?.data?.message || error?.message || "Error al crear catering";
      toast.error(message);
    },
  });
}

export function useUpdateCatering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCateringDto }) =>
      cateringsService.update(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cateringKeys.list() });
      queryClient.setQueryData(cateringKeys.detail(data.id), data);
      toast.success("Catering actualizado exitosamente");
    },
    onError: (error: any) => {
      const message = error?.data?.message || error?.message || "Error al actualizar catering";
      toast.error(message);
    },
  });
}

export function useDeleteCatering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cateringsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cateringKeys.list() });
      toast.success("Catering desactivado");
    },
    onError: (error: any) => {
      const message = error?.data?.message || error?.message || "Error al desactivar catering";
      toast.error(message);
    },
  });
}
