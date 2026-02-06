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
import { ChevronLeft, ChevronRight, ArrowLeft, Check, DollarSign, Users } from "lucide-react";

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
       <Breadcrumbs />
       
       {/* Header */}
       <div className="space-y-4">
         <Button
           variant="ghost"
           size="sm"
           onClick={() => router.push("/contracts")}
           className="text-slate-600 hover:text-slate-900"
         >
           <ArrowLeft className="h-4 w-4 mr-1" />
           Volver a Contratos
         </Button>
         
         <div className="space-y-2">
           <h1 className="text-3xl font-bold text-slate-900">Servicios del Contrato</h1>
           <p className="text-slate-600 max-w-2xl">
             Gestiona los días de servicio de este contrato. Confirma cantidades esperadas (cliente) 
             y servidas (catering) para cada día.
           </p>
         </div>

         {/* Contract Details Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
             <p className="text-xs text-blue-600 font-semibold mb-1">📊 CANTIDAD DIARIA</p>
             <p className="text-lg font-bold text-slate-900">
               {contract.minDailyQuantity} - {contract.maxDailyQuantity}
             </p>
             <p className="text-xs text-slate-600 mt-1">Rango de servicios por día</p>
           </div>
           
           <div className="bg-green-50 border border-green-200 rounded-lg p-3">
             <p className="text-xs text-green-600 font-semibold mb-1">💰 PRECIO POR SERVICIO</p>
             <p className="text-lg font-bold text-slate-900">
               ${contract.pricePerService.toFixed(2)}
             </p>
             <p className="text-xs text-slate-600 mt-1">Costo unitario</p>
           </div>

           <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
             <p className="text-xs text-purple-600 font-semibold mb-1">📅 DÍAS DE SERVICIO</p>
             <p className="text-lg font-bold text-slate-900">
               {contract.serviceDays.length}
             </p>
             <p className="text-xs text-slate-600 mt-1">
               {contract.serviceDays.sort().join(", ").substring(0, 20)}...
             </p>
           </div>
         </div>
       </div>

       {/* Week Navigator */}
       <Card>
         <CardHeader className="pb-3">
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div>
               <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                 📅 Semana del {weekLabel}
               </CardTitle>
               <p className="text-sm text-slate-500 mt-1">
                 Haz clic en los botones para navegar entre semanas
               </p>
             </div>
             <div className="flex gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setWeekOffset((w) => w - 1)}
                 className="hover:bg-blue-50"
               >
                 <ChevronLeft className="h-4 w-4 mr-1" />
                 Anterior
               </Button>
               <Button
                 variant={weekOffset === 0 ? "default" : "outline"}
                 size="sm"
                 onClick={() => setWeekOffset(0)}
                 className={weekOffset === 0 ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50"}
               >
                 Hoy
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setWeekOffset((w) => w + 1)}
                 className="hover:bg-blue-50"
               >
                 Siguiente
                 <ChevronRight className="h-4 w-4 ml-1" />
               </Button>
             </div>
           </div>
         </CardHeader>
         <CardContent>
           {serviceDays && serviceDays.length === 0 ? (
             <div className="text-center py-12 text-slate-500">
               <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
               <p className="text-lg font-semibold text-slate-900">No hay servicios esta semana</p>
               <p className="text-sm mt-1">Intenta navegar a otra semana</p>
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>📅 Fecha</TableHead>
                   <TableHead className="text-center">👥 Esperado</TableHead>
                   <TableHead className="text-center">✅ Servido</TableHead>
                   <TableHead className="text-center">Estado</TableHead>
                   <TableHead className="text-right">Acciones</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {serviceDays?.map((day) => (
                   <TableRow key={day.id} className="hover:bg-blue-50">
                     <TableCell className="font-medium text-slate-900">
                       {formatDate(day.serviceDate)}
                     </TableCell>
                     <TableCell className="text-center">
                       <div className="font-semibold text-slate-900">
                         {day.expectedQuantity !== null ? (
                           <span>
                             {day.expectedQuantity}
                             {day.expectedConfirmedAt && (
                               <Check className="h-4 w-4 inline ml-2 text-green-600 align-baseline" />
                             )}
                           </span>
                         ) : (
                           <span className="text-slate-400">-</span>
                         )}
                       </div>
                       {day.expectedQuantity === null && (
                         <p className="text-xs text-yellow-600 mt-1">Sin confirmar</p>
                       )}
                     </TableCell>
                     <TableCell className="text-center">
                       <div className="font-semibold text-slate-900">
                         {day.servedQuantity !== null ? (
                           <span>
                             {day.servedQuantity}
                             {day.servedConfirmedAt && (
                               <Check className="h-4 w-4 inline ml-2 text-green-600 align-baseline" />
                             )}
                           </span>
                         ) : (
                           <span className="text-slate-400">-</span>
                         )}
                       </div>
                       {day.servedQuantity === null && (
                         <p className="text-xs text-yellow-600 mt-1">Sin confirmar</p>
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
                       <div className="flex gap-1.5 justify-end">
                         {canConfirmExpected(day) && (
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => openDialog(day, "expected")}
                             className="hover:bg-blue-50 text-xs"
                             title="Confirma la cantidad esperada de servicios"
                           >
                             Cantidad Esperada
                           </Button>
                         )}
                         {canConfirmServed(day) && (
                           <Button
                             variant="default"
                             size="sm"
                             onClick={() => openDialog(day, "served")}
                             className="bg-blue-600 hover:bg-blue-700 text-xs"
                             title="Confirma la cantidad realmente servida"
                           >
                             Cantidad Servida
                           </Button>
                         )}
                         {day.status === "CONFIRMED" && (
                           <span className="text-xs text-green-600 font-semibold px-2 py-1">
                             ✓ Completado
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
         <div>
           <div className="mb-4">
             <h2 className="text-lg font-semibold text-slate-900">Resumen de la Semana</h2>
             <p className="text-sm text-slate-500 mt-1">Totales de servicios para el período mostrado</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-400">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                   <Users className="h-4 w-4 text-yellow-600" />
                   Total Esperado
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-3xl font-bold text-slate-900">
                   {serviceDays.reduce(
                     (sum, d) => sum + (d.expectedQuantity || 0),
                     0,
                   )}
                 </p>
                 <p className="text-xs text-slate-500 mt-2">Personas a servir esta semana</p>
               </CardContent>
             </Card>
             
             <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-400">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                   <Check className="h-4 w-4 text-green-600" />
                   Total Servido
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-3xl font-bold text-slate-900">
                   {serviceDays.reduce(
                     (sum, d) => sum + (d.servedQuantity || 0),
                     0,
                   )}
                 </p>
                 <p className="text-xs text-slate-500 mt-2">Personas ya servidas</p>
               </CardContent>
             </Card>
             
             <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-400">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm text-slate-600">
                   Días Confirmados
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-3xl font-bold text-slate-900">
                   {serviceDays.filter((d) => d.status === "CONFIRMED").length} /{" "}
                   {serviceDays.length}
                 </p>
                 <p className="text-xs text-slate-500 mt-2">
                   {serviceDays.length === serviceDays.filter((d) => d.status === "CONFIRMED").length
                     ? "✓ Todos confirmados"
                     : "Aún por confirmar"}
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>
       )}

       {/* Confirm Dialog */}
       <Dialog open={!!selectedDay} onOpenChange={() => closeDialog()}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="text-lg">
               {dialogType === "expected"
                 ? "✍️ Confirmar Cantidad Esperada"
                 : "✅ Confirmar Cantidad Servida"}
             </DialogTitle>
             <DialogDescription>
               {selectedDay && (
                 <div className="mt-4 space-y-3">
                   <div>
                     <p className="text-xs text-slate-500 font-semibold">FECHA</p>
                     <p className="text-sm font-medium text-slate-900 mt-1">
                       📅 {formatDate(selectedDay.serviceDate)}
                     </p>
                   </div>
                   
                   {dialogType === "expected" && contract && (
                     <div>
                       <p className="text-xs text-slate-500 font-semibold">RANGO PERMITIDO</p>
                       <p className="text-sm font-medium text-slate-900 mt-1">
                         👥 {contract.minDailyQuantity} - {contract.maxDailyQuantity} servicios
                       </p>
                       <p className="text-xs text-slate-500 mt-1">
                         Confirma la cantidad esperada dentro de este rango
                       </p>
                     </div>
                   )}
                   
                   {dialogType === "served" && selectedDay.expectedQuantity && (
                     <div>
                       <p className="text-xs text-slate-500 font-semibold">CANTIDAD ESPERADA</p>
                       <p className="text-sm font-medium text-slate-900 mt-1">
                         👥 {selectedDay.expectedQuantity} servicios
                       </p>
                       <p className="text-xs text-slate-500 mt-1">
                         Confirma la cantidad realmente servida
                       </p>
                     </div>
                   )}
                 </div>
               )}
             </DialogDescription>
           </DialogHeader>
           <div className="py-4 space-y-2">
             <label className="text-sm font-semibold text-slate-900">
               Cantidad a Confirmar
             </label>
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
               placeholder="Ingresa la cantidad"
               className="text-lg font-medium bg-white border-slate-300"
             />
             <p className="text-xs text-slate-500 mt-2">
               {dialogType === "expected"
                 ? `Rango: ${contract?.minDailyQuantity} - ${contract?.maxDailyQuantity}`
                 : "Ingresa la cantidad servida realmente"}
             </p>
           </div>
           <DialogFooter className="gap-2">
             <Button variant="outline" onClick={closeDialog} className="flex-1">
               Cancelar
             </Button>
             <Button
               onClick={handleConfirm}
               disabled={
                 !quantity ||
                 confirmExpected.isPending ||
                 confirmServed.isPending
               }
               className="flex-1 bg-blue-600 hover:bg-blue-700"
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
