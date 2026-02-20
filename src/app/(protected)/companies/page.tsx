"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  useCaterings,
  useDeleteCatering,
  useClients,
  useDeleteClient,
} from "@/hooks";
import { CateringFormDialog } from "@/components/companies/catering-form-dialog";
import { ClientFormDialog } from "@/components/companies/client-form-dialog";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function CompaniesPage() {
  const { data: caterings, isLoading: isLoadingCaterings } = useCaterings();
  const { data: clients, isLoading: isLoadingClients } = useClients();
  const deleteCateringMutation = useDeleteCatering();
  const deleteClientMutation = useDeleteClient();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "catering" | "client" | null;
    id: string | null;
    name: string | null;
  }>({ open: false, type: null, id: null, name: null });

  const handleDelete = () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    if (deleteDialog.type === "catering") {
      deleteCateringMutation.mutate(deleteDialog.id);
    } else {
      deleteClientMutation.mutate(deleteDialog.id);
    }

    setDeleteDialog({ open: false, type: null, id: null, name: null });
  };

   return (
     <div className="space-y-6">
       <Breadcrumbs />
       <div>
        <h1 className="text-3xl font-bold">Empresas</h1>
        <p className="text-gray-500">Gestión de empresas de catering y clientes</p>
      </div>

      <Tabs defaultValue="caterings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="caterings">Caterings</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        {/* Caterings Tab */}
        <TabsContent value="caterings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Empresas de Catering</CardTitle>
              <CateringFormDialog />
            </CardHeader>
            <CardContent>
              {isLoadingCaterings ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : !caterings || caterings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No hay caterings registrados
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CUIT</TableHead>
                      <TableHead className="text-center">Capacidad Diaria</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caterings.map((catering) => (
                      <TableRow key={catering.id}>
                        <TableCell className="font-medium">
                          {catering.name}
                        </TableCell>
                        <TableCell>{catering.email}</TableCell>
                        <TableCell>{catering.taxId || "-"}</TableCell>
                        <TableCell className="text-center">
                          {catering.dailyCapacity}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              catering.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {catering.status === "ACTIVE" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <CateringFormDialog
                              catering={catering}
                              trigger={
                                <Button size="sm" variant="ghost">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "catering",
                                  id: catering.id,
                                  name: catering.name,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Empresas Cliente</CardTitle>
              <ClientFormDialog />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : !clients || clients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No hay clientes registrados
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CUIT</TableHead>
                      <TableHead>Modo de Trabajo</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          {client.name}
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.taxId || "-"}</TableCell>
                        <TableCell>
                          {client.workMode === "REMOTE"
                            ? "Remoto"
                            : client.workMode === "HYBRID"
                              ? "Híbrido"
                              : "Presencial"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              client.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {client.status === "ACTIVE" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <ClientFormDialog
                              client={client}
                              trigger={
                                <Button size="sm" variant="ghost">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "client",
                                  id: client.id,
                                  name: client.name,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, type: null, id: null, name: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto desactivará {deleteDialog.type === "catering" ? "el catering" : "el cliente"}{" "}
              <strong>{deleteDialog.name}</strong>. Los contratos existentes no se verán afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
