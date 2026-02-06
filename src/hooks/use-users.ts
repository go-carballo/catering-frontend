import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService, type CreateUserDto, type UpdateUserDto } from "@/services/users.service";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => usersService.list(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.setQueryData(userKeys.detail(data.id), data);
      toast.success("Usuario creado exitosamente");
    },
    onError: (error: any) => {
      const message =
        error?.data?.message || error?.message || "Error al crear usuario";
      toast.error(message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      usersService.update(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.setQueryData(userKeys.detail(data.id), data);
      toast.success("Usuario actualizado exitosamente");
    },
    onError: (error: any) => {
      const message =
        error?.data?.message ||
        error?.message ||
        "Error al actualizar usuario";
      toast.error(message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("Usuario eliminado");
    },
    onError: (error: any) => {
      const message =
        error?.data?.message || error?.message || "Error al eliminar usuario";
      toast.error(message);
    },
  });
}
