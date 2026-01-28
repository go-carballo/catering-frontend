import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService, type CreateClientDto, type UpdateClientDto } from "@/services/clients.service";
import { toast } from "sonner";

export const clientKeys = {
  all: ["clients"] as const,
  list: () => [...clientKeys.all, "list"] as const,
  detail: (id: string) => [...clientKeys.all, "detail", id] as const,
};

export function useClients() {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: () => clientsService.list(),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateClientDto) => clientsService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.list() });
      queryClient.setQueryData(clientKeys.detail(data.id), data);
      toast.success("Cliente creado exitosamente");
    },
    onError: (error: any) => {
      const message = error?.data?.message || error?.message || "Error al crear cliente";
      toast.error(message);
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateClientDto }) =>
      clientsService.update(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.list() });
      queryClient.setQueryData(clientKeys.detail(data.id), data);
      toast.success("Cliente actualizado exitosamente");
    },
    onError: (error: any) => {
      const message = error?.data?.message || error?.message || "Error al actualizar cliente";
      toast.error(message);
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.list() });
      toast.success("Cliente desactivado");
    },
    onError: (error: any) => {
      const message = error?.data?.message || error?.message || "Error al desactivar cliente";
      toast.error(message);
    },
  });
}
