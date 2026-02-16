"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil } from "lucide-react";

import {
  createCateringSchema,
  updateCateringSchema,
  type CateringFormData,
} from "@/lib/validations/catering";
import { useCreateCatering, useUpdateCatering } from "@/hooks";
import type { Catering, CreateCateringDto } from "@/services/caterings.service";

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
import { Input } from "@/components/ui/input";

interface CateringFormDialogProps {
  catering?: Catering;
  trigger?: React.ReactNode;
}

export function CateringFormDialog({ catering, trigger }: CateringFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!catering;

  const createMutation = useCreateCatering();
  const updateMutation = useUpdateCatering();

  const form = useForm<CateringFormData>({
    resolver: zodResolver(isEdit ? updateCateringSchema : createCateringSchema) as Resolver<CateringFormData>,
    defaultValues: isEdit
      ? {
          name: catering.name,
          taxId: catering.taxId || "",
          dailyCapacity: catering.dailyCapacity,
        }
      : {
          name: "",
          email: "",
          password: "",
          taxId: "",
          dailyCapacity: 100,
        },
  });

  useEffect(() => {
    if (open && catering) {
      form.reset({
        name: catering.name,
        taxId: catering.taxId || "",
        dailyCapacity: catering.dailyCapacity,
      });
    }
  }, [open, catering, form]);

  const onSubmit = async (data: CateringFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: catering.id,
          dto: data,
        });
      } else {
        await createMutation.mutateAsync(data as CreateCateringDto);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Catering form submission error:", error);
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
                 Nuevo Catering
               </>
             )}
           </Button>
         )}
       </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Catering" : "Crear Nuevo Catering"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza la información del catering"
              : "Completa los datos para crear un nuevo catering"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Delicias del Sur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@catering.com"
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
                      <FormDescription>
                        Mínimo 6 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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

            <FormField
              control={form.control}
              name="dailyCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad Diaria</FormLabel>
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
                  <FormDescription>
                    Cantidad máxima de servicios que puede producir por día
                  </FormDescription>
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
