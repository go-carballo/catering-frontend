"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import {
  createContractSchema,
  type CreateContractFormData,
} from "@/lib/validations/contract";
import { useCreateContract, useCaterings, useClients } from "@/hooks";
import { dayNames, type DayOfWeek } from "@/types/contract";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function CreateContractDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateContract();
  const { data: caterings, isLoading: isLoadingCaterings } = useCaterings();
  const { data: clients, isLoading: isLoadingClients } = useClients();

  const form = useForm({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      cateringCompanyId: "",
      clientCompanyId: "",
      pricePerService: 15,
      flexibleQuantity: true,
      minDailyQuantity: 20,
      maxDailyQuantity: 50,
      noticePeriodHours: 24,
      serviceDays: [],
    },
  });

  const onSubmit = async (data: CreateContractFormData) => {
    try {
      // @ts-ignore - Type mismatch with react-hook-form but works at runtime
      await createMutation.mutateAsync(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const days: { value: DayOfWeek; label: string }[] = [
    { value: 1, label: dayNames[1] },
    { value: 2, label: dayNames[2] },
    { value: 3, label: dayNames[3] },
    { value: 4, label: dayNames[4] },
    { value: 5, label: dayNames[5] },
    { value: 6, label: dayNames[6] },
    { value: 7, label: dayNames[7] },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         <Button>
           <Plus className="h-4 w-4" />
           Nuevo Contrato
         </Button>
       </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Contrato</DialogTitle>
          <DialogDescription>
            Completa los datos del contrato entre la empresa de catering y el
            cliente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Empresas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                // @ts-ignore
                control={form.control}
                name="cateringCompanyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa de Catering</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCaterings ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : (
                          caterings?.map((catering) => (
                            <SelectItem key={catering.id} value={catering.id}>
                              {catering.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-ignore
                control={form.control}
                name="clientCompanyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingClients ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : (
                          clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                // @ts-ignore
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Si no se especifica, comienza hoy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-ignore
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Si no se especifica, es indefinido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cantidades */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                // @ts-ignore
                control={form.control}
                name="minDailyQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad Mínima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-ignore
                control={form.control}
                name="maxDailyQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad Máxima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-ignore
                control={form.control}
                name="pricePerService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por Servicio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="15.50"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Período de aviso */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="noticePeriodHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período de Aviso (horas)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Horas de anticipación para confirmar cantidad (ej: 24h = 1
                    día)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Días de servicio */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="serviceDays"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Días de Servicio
                    </FormLabel>
                    <FormDescription>
                      Selecciona los días en que se prestará el servicio
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {days.map((day) => (
                      <FormField
                        key={day.value}
                        // @ts-ignore
                        control={form.control}
                        name="serviceDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, day.value])
                                      : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== day.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cantidad flexible */}
            <FormField
              // @ts-ignore
              control={form.control}
              name="flexibleQuantity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cantidad flexible</FormLabel>
                    <FormDescription>
                      Permite al cliente modificar la cantidad dentro del rango
                      mínimo/máximo
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear Contrato"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
