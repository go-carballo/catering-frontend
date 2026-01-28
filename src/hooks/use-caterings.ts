import { useQuery } from "@tanstack/react-query";
import { cateringsService } from "@/services/caterings.service";

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
