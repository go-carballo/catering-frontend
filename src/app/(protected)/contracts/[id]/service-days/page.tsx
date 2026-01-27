"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useContract } from "@/hooks/use-contracts";
import {
  useServiceDays,
  useConfirmExpected,
  useConfirmServed,
} from "@/hooks/use-service-days";
import { useAuth } from "@/providers";
import {
  getCurrentWeekRange,
  getWeekRange,
  formatDateParam,
  getWeekStart,
} from "@/services/service-days.service";
import { serviceDayStatusDisplay } from "@/types/service-day";
import type { ServiceDay } from "@/types/service-day";

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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowLeft, Check } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDaysPage({ params }: PageProps) {
  const { id: contractId } = use(params);
  const router = useRouter();
  const { company } = useAuth();

  // Week navigation state
  const [weekOffset, setWeekOffset] = useState(0);
  const weekRange = useMemo(() => getWeekRange(weekOffset), [weekOffset]);

  // Data fetching
  const { data: contract, isLoading: contractLoading } =
    useContract(contractId);
  const { data: serviceDays, isLoading: daysLoading } = useServiceDays(
    contractId,
    weekRange,
  );

  // Mutations
  const confirmExpected = useConfirmExpected(contractId, weekRange);
  const confirmServed = useConfirmServed(contractId, weekRange);

  // Dialog state
  const [selectedDay, setSelectedDay] = useState<ServiceDay | null>(null);
  const [dialogType, setDialogType] = useState<"expected" | "served" | null>(
    null,
  );
  const [quantity, setQuantity] = useState("");

  // Determine user's company type from contract
  const isClient = contract && company?.id === contract.clientCompanyId;
  const isCatering = contract && company?.id === contract.cateringCompanyId;

  const openDialog = (day: ServiceDay, type: "expected" | "served") => {
    setSelectedDay(day);
    setDialogType(type);
    // Pre-fill with expected quantity for served, or min quantity for expected
    if (type === "served" && day.expectedQuantity) {
      setQuantity(day.expectedQuantity.toString());
    } else if (type === "expected" && contract) {
      setQuantity(contract.minDailyQuantity.toString());
    } else {
      setQuantity("");
    }
  };

  const closeDialog = () => {
    setSelectedDay(null);
    setDialogType(null);
    setQuantity("");
  };

  const handleConfirm = () => {
    if (!selectedDay || !dialogType) return;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) return;

    if (dialogType === "expected") {
      confirmExpected.mutate(
        {
          serviceDayId: selectedDay.id,
          dto: { expectedQuantity: qty },
        },
        {
          onSuccess: closeDialog,
        },
      );
    } else {
      confirmServed.mutate(
        {
          serviceDayId: selectedDay.id,
          dto: { servedQuantity: qty },
        },
        {
          onSuccess: closeDialog,
        },
      );
    }
  };

  const canConfirmExpected = (day: ServiceDay) => {
    return (
      isClient && day.status === "PENDING" && day.expectedConfirmedAt === null
    );
  };

  const canConfirmServed = (day: ServiceDay) => {
    return (
      isCatering && day.status === "PENDING" && day.expectedQuantity !== null
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const isLoading = contractLoading || daysLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center text-red-600 py-8">
        Contrato no encontrado
      </div>
    );
  }

  const weekStartDate = new Date(weekRange.from!);
  const weekLabel = weekStartDate.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/contracts")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Servicios del Contrato</h1>
          <p className="text-gray-500">
            {contract.minDailyQuantity} - {contract.maxDailyQuantity}{" "}
            servicios/día | ${contract.pricePerService.toFixed(2)}/servicio
          </p>
        </div>
      </div>

      {/* Week Navigator */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Semana del {weekLabel}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset((w) => w - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(0)}
                disabled={weekOffset === 0}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset((w) => w + 1)}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {serviceDays && serviceDays.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay días de servicio para esta semana
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-center">Esperado</TableHead>
                  <TableHead className="text-center">Servido</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceDays?.map((day) => (
                  <TableRow key={day.id}>
                    <TableCell className="font-medium">
                      {formatDate(day.serviceDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      {day.expectedQuantity !== null ? (
                        <span className="font-semibold">
                          {day.expectedQuantity}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      {day.expectedConfirmedAt && (
                        <Check className="h-4 w-4 inline ml-1 text-green-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {day.servedQuantity !== null ? (
                        <span className="font-semibold">
                          {day.servedQuantity}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      {day.servedConfirmedAt && (
                        <Check className="h-4 w-4 inline ml-1 text-green-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={serviceDayStatusDisplay[day.status].color}
                      >
                        {serviceDayStatusDisplay[day.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {canConfirmExpected(day) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(day, "expected")}
                          >
                            Confirmar Esperado
                          </Button>
                        )}
                        {canConfirmServed(day) && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openDialog(day, "served")}
                          >
                            Confirmar Servido
                          </Button>
                        )}
                        {day.status === "CONFIRMED" && (
                          <span className="text-sm text-gray-500 italic">
                            Completado
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {serviceDays && serviceDays.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Total Esperado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {serviceDays.reduce(
                  (sum, d) => sum + (d.expectedQuantity || 0),
                  0,
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Total Servido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {serviceDays.reduce(
                  (sum, d) => sum + (d.servedQuantity || 0),
                  0,
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {serviceDays.filter((d) => d.status === "CONFIRMED").length} /{" "}
                {serviceDays.length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "expected"
                ? "Confirmar Cantidad Esperada"
                : "Confirmar Cantidad Servida"}
            </DialogTitle>
            <DialogDescription>
              {selectedDay && (
                <>
                  Fecha: {formatDate(selectedDay.serviceDate)}
                  <br />
                  {dialogType === "expected" && contract && (
                    <>
                      Rango permitido: {contract.minDailyQuantity} -{" "}
                      {contract.maxDailyQuantity}
                    </>
                  )}
                  {dialogType === "served" && selectedDay.expectedQuantity && (
                    <>Cantidad esperada: {selectedDay.expectedQuantity}</>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              min={dialogType === "expected" ? contract?.minDailyQuantity : 0}
              max={
                dialogType === "expected"
                  ? contract?.maxDailyQuantity
                  : undefined
              }
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Cantidad"
              className="text-lg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                !quantity ||
                confirmExpected.isPending ||
                confirmServed.isPending
              }
            >
              {confirmExpected.isPending || confirmServed.isPending
                ? "Guardando..."
                : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
