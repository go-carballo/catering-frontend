"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil } from "lucide-react";

import {
  createClientSchema,
  updateClientSchema,
  type ClientFormData,
} from "@/lib/validations/client";
import { useCreateClient, useUpdateClient } from "@/hooks";
import type { Client, CreateClientDto, WorkMode, DayOfWeek } from "@/services/clients.service";
import { dayNames } from "@/types/contract";

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

interface ClientFormDialogProps {
  client?: Client;
  trigger?: React.ReactNode;
}

const workModeOptions: { value: WorkMode; label: string }[] = [
  { value: "REMOTE", label: "Remoto" },
  { value: "HYBRID", label: "Híbrido" },
  { value: "ONSITE", label: "Presencial" },
];

const officeDaysOptions: { value: DayOfWeek; label: string }[] = [
  { value: 1, label: dayNames[1] },
  { value: 2, label: dayNames[2] },
  { value: 3, label: dayNames[3] },
  { value: 4, label: dayNames[4] },
  { value: 5, label: dayNames[5] },
  { value: 6, label: dayNames[6] },
  { value: 7, label: dayNames[7] },
];

export function ClientFormDialog({ client, trigger }: ClientFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!client;

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(isEdit ? updateClientSchema : createClientSchema) as Resolver<ClientFormData>,
    defaultValues: isEdit
      ? {
          name: client.name,
          taxId: client.taxId || "",
          workMode: client.workMode,
          officeDays: client.officeDays,
        }
      : {
          name: "",
          email: "",
          password: "",
          taxId: "",
          workMode: "HYBRID" as WorkMode,
          officeDays: [1, 2, 3, 4, 5] as DayOfWeek[],
        },
  });

  useEffect(() => {
    if (open && client) {
      form.reset({
        name: client.name,
        taxId: client.taxId || "",
        workMode: client.workMode,
        officeDays: client.officeDays,
      });
    }
  }, [open, client, form]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: client.id,
          dto: data,
        });
      } else {
        await createMutation.mutateAsync(data as CreateClientDto);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Client form submission error:", error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         {trigger || (
           <Button size={isEdit ? "sm" : "default"} variant={isEdit ? "ghost" : "default"}>
             {isEdit ? (
               <Pencil className="h-4 w-4" />
             ) : (
               <>
                 <Plus className="h-4 w-4" />
                 Nuevo Cliente
               </>
             )}
           </Button>
         )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza la información del cliente"
              : "Completa los datos para crear un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Corp SA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email and Password (only for create) */}
            {!isEdit && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@empresa.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>Mínimo 6 caracteres</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Tax ID */}
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUIT (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="20-12345678-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Mode */}
            <FormField
              control={form.control}
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modo de Trabajo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workModeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Define cómo trabajan los empleados de esta empresa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Office Days */}
            <FormField
              control={form.control}
              name="officeDays"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Días en Oficina</FormLabel>
                    <FormDescription>
                      Selecciona los días que los empleados van a la oficina
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {officeDaysOptions.map((day) => (
                      <FormField
                        key={day.value}
                        control={form.control}
                        name="officeDays"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Actualizando..."
                    : "Creando..."
                  : isEdit
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
