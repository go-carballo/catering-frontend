"use client";

import { useRouter } from "next/navigation";
import {
  useContracts,
  usePauseContract,
  useResumeContract,
  useTerminateContract,
} from "@/hooks";
import { useAuth } from "@/providers";
import { statusDisplay, dayNames } from "@/types/contract";
import type { Contract } from "@/types/contract";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Play, Pause, XCircle, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { CreateContractDialog } from "@/components/contracts/create-contract-dialog";

export default function ContractsPage() {
  const router = useRouter();
  const { company } = useAuth();
  const { data: contracts, isLoading, error } = useContracts();

  const pauseMutation = usePauseContract();
  const resumeMutation = useResumeContract();
  const terminateMutation = useTerminateContract();

  const [actionContract, setActionContract] = useState<Contract | null>(null);
  const [actionType, setActionType] = useState<
    "pause" | "resume" | "terminate" | null
  >(null);

  // Client companies can manage contracts
  const isClient = company?.companyType === "CLIENT";

  const handleAction = () => {
    if (!actionContract || !actionType) return;

    switch (actionType) {
      case "pause":
        pauseMutation.mutate(actionContract.id);
        break;
      case "resume":
        resumeMutation.mutate(actionContract.id);
        break;
      case "terminate":
        terminateMutation.mutate(actionContract.id);
        break;
    }
    setActionContract(null);
    setActionType(null);
  };

  const openAction = (
    contract: Contract,
    type: "pause" | "resume" | "terminate",
  ) => {
    setActionContract(contract);
    setActionType(type);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error al cargar contratos: {error.message}
      </div>
    );
  }

   return (
     <div className="space-y-6">
       <Breadcrumbs />
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contratos</h1>
          <p className="text-gray-500">Gestiona los contratos de tu empresa</p>
        </div>
        <CreateContractDialog />
      </div>

      {contracts && contracts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay contratos registrados
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Días de Servicio</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio/Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts?.filter(contract => contract.status !== "TERMINATED").map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-mono text-sm">
                    {contract.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {contract.serviceDays.sort().map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {dayNames[day].slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contract.minDailyQuantity} - {contract.maxDailyQuantity}
                  </TableCell>
                  <TableCell>${contract.pricePerService.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusDisplay[contract.status].color}>
                      {statusDisplay[contract.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/contracts/${contract.id}/service-days`)
                        }
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Servicios
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/contracts/${contract.id}/reports`)
                        }
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Reporte
                      </Button>

                      {/* Contract actions - only for clients */}
                      {contract.status === "ACTIVE" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAction(contract, "pause")}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}

                      {contract.status === "PAUSED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAction(contract, "resume")}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}

                      {isClient && contract.status !== "TERMINATED" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openAction(contract, "terminate")}
                          title="Solo el cliente puede terminar contratos"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!actionContract}
        onOpenChange={() => setActionContract(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "pause" && "Pausar Contrato"}
              {actionType === "resume" && "Reactivar Contrato"}
              {actionType === "terminate" && "Terminar Contrato"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "pause" &&
                "¿Estás seguro de que querés pausar este contrato? No se generarán nuevos días de servicio hasta que lo reactives."}
              {actionType === "resume" &&
                "¿Estás seguro de que querés reactivar este contrato?"}
              {actionType === "terminate" &&
                "¿Estás seguro de que querés terminar este contrato? Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                actionType === "terminate" ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
