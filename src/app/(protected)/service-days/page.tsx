"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useContracts, useAllServiceDays } from "@/hooks";
import {
  getCurrentWeekRange,
  formatDateParam,
} from "@/services/service-days.service";
import { serviceDayStatusDisplay } from "@/types/service-day";
import type { ServiceDay, ServiceDayStatus } from "@/types/service-day";
import type { Contract } from "@/types/contract";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  ListChecks,
  Building2,
} from "lucide-react";

export default function ServiceDaysPage() {
  const router = useRouter();

  // Fetch contracts
  const { data: contracts, isLoading: contractsLoading } = useContracts();

  // Date range state - default to current week
  const [dateRange, setDateRange] = useState(() => getCurrentWeekRange());
  const [fromDate, setFromDate] = useState(dateRange.from);
  const [toDate, setToDate] = useState(dateRange.to);

  // Filters state
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ServiceDayStatus | "ALL">(
    "ALL",
  );

  // Fetch service days with current filters
  const { data: serviceDays, isLoading: daysLoading } = useAllServiceDays(
    contracts,
    dateRange,
    selectedContractIds.length > 0 ? selectedContractIds : undefined,
  );

  // Apply client-side filters
  const filteredServiceDays = useMemo(() => {
    if (!serviceDays) return [];

    let filtered = serviceDays;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((day) => day.status === statusFilter);
    }

    // Sort by date (most recent first)
    filtered.sort(
      (a, b) =>
        new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime(),
    );

    return filtered;
  }, [serviceDays, statusFilter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!filteredServiceDays) return null;

    const pending = filteredServiceDays.filter(
      (d) => d.status === "PENDING",
    ).length;
    const confirmed = filteredServiceDays.filter(
      (d) => d.status === "CONFIRMED",
    ).length;
    const totalExpected = filteredServiceDays.reduce(
      (sum, d) => sum + (d.expectedQuantity || 0),
      0,
    );
    const totalServed = filteredServiceDays.reduce(
      (sum, d) => sum + (d.servedQuantity || 0),
      0,
    );

    return {
      total: filteredServiceDays.length,
      pending,
      confirmed,
      totalExpected,
      totalServed,
    };
  }, [filteredServiceDays]);

  // Get contract name by ID
  const getContractName = (contractId: string) => {
    const contract = contracts?.find((c) => c.id === contractId);
    if (!contract) return "Desconocido";
    return `${contract.cateringName || "Catering"} - ${contract.clientName || "Cliente"}`;
  };

  // Handle date range update
  const handleApplyDateRange = () => {
    setDateRange({ from: fromDate, to: toDate });
  };

  // Reset to current week
  const handleResetToCurrentWeek = () => {
    const currentWeek = getCurrentWeekRange();
    setFromDate(currentWeek.from);
    setToDate(currentWeek.to);
    setDateRange(currentWeek);
  };

  // Toggle contract filter
  const toggleContractFilter = (contractId: string) => {
    setSelectedContractIds((prev) =>
      prev.includes(contractId)
        ? prev.filter((id) => id !== contractId)
        : [...prev, contractId],
    );
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isLoading = contractsLoading || daysLoading;

  if (contractsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

   return (
     <div className="space-y-6">
       <Breadcrumbs />
       {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Servicios</h1>
        <p className="text-gray-500">
          Vista consolidada de todos los días de servicio
        </p>
      </div>

       {/* Filters Section */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Filter className="h-5 w-5" />
             Filtros y Búsqueda
           </CardTitle>
           <p className="text-sm text-slate-500 mt-2">
             Filtra los días de servicio por fecha, estado y contrato para encontrar exactamente lo que necesitas.
           </p>
         </CardHeader>
         <CardContent className="space-y-6">
           {/* Date Range Filter */}
           <div className="space-y-3">
             <div className="flex items-center gap-2">
               <CalendarIcon className="h-4 w-4 text-blue-600" />
               <label className="text-sm font-semibold text-slate-900">Rango de Fechas</label>
               <span className="text-xs text-slate-500">(Selecciona el período a visualizar)</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Desde</label>
                 <Input
                   type="date"
                   value={fromDate}
                   onChange={(e) => setFromDate(e.target.value)}
                   className="bg-white"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Hasta</label>
                 <Input
                   type="date"
                   value={toDate}
                   onChange={(e) => setToDate(e.target.value)}
                   className="bg-white"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Acciones</label>
                 <div className="flex gap-2 h-10">
                   <Button 
                     onClick={handleApplyDateRange}
                     className="flex-1 bg-blue-600 hover:bg-blue-700"
                   >
                     <CalendarIcon className="h-4 w-4 mr-1" />
                     Aplicar
                   </Button>
                   <Button
                     variant="outline"
                     onClick={handleResetToCurrentWeek}
                     className="flex-1"
                     title="Vuelve al rango de la semana actual"
                   >
                     <RefreshCw className="h-4 w-4 mr-1" />
                     Semana Actual
                   </Button>
                 </div>
               </div>
             </div>
           </div>

           {/* Status Filter */}
           <div className="space-y-3">
             <div className="flex items-center gap-2">
               <CheckCircle2 className="h-4 w-4 text-blue-600" />
               <label className="text-sm font-semibold text-slate-900">Estado del Servicio</label>
               <span className="text-xs text-slate-500">(Filtra por confirmación)</span>
             </div>
             <Select
               value={statusFilter}
               onValueChange={(value) =>
                 setStatusFilter(value as ServiceDayStatus | "ALL")
               }
             >
               <SelectTrigger className="bg-white max-w-xs">
                 <SelectValue placeholder="Seleccionar estado" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ALL">
                   <span>📋 Todos - Muestra todos los servicios</span>
                 </SelectItem>
                 <SelectItem value="PENDING">
                   <span>⏳ Pendientes - Servicios sin confirmar</span>
                 </SelectItem>
                 <SelectItem value="CONFIRMED">
                   <span>✅ Confirmados - Servicios confirmados</span>
                 </SelectItem>
               </SelectContent>
             </Select>
           </div>

           {/* Contract Filter */}
           {contracts && contracts.length > 0 && (
             <div className="space-y-3">
               <div className="flex items-center gap-2">
                 <Building2 className="h-4 w-4 text-blue-600" />
                 <label className="text-sm font-semibold text-slate-900">
                   Contratos
                 </label>
                 <span className="text-xs text-slate-500">
                   (Haz clic para seleccionar/deseleccionar)
                 </span>
               </div>
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-slate-600">
                     {selectedContractIds.length > 0 
                       ? `${selectedContractIds.length} contrato${selectedContractIds.length !== 1 ? 's' : ''} seleccionado${selectedContractIds.length !== 1 ? 's' : ''}`
                       : "Todos los contratos (sin filtrar)"}
                   </span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {contracts.map((contract) => (
                     <Badge
                       key={contract.id}
                       variant={
                         selectedContractIds.includes(contract.id)
                           ? "default"
                           : "outline"
                       }
                       className="cursor-pointer hover:shadow-md transition-shadow"
                       onClick={() => toggleContractFilter(contract.id)}
                       title={`Haz clic para ${selectedContractIds.includes(contract.id) ? 'deseleccionar' : 'seleccionar'} este contrato`}
                     >
                       {contract.cateringName || "Catering"} - {contract.clientName || "Cliente"}
                     </Badge>
                   ))}
                 </div>
                 {selectedContractIds.length > 0 && (
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setSelectedContractIds([])}
                     className="text-slate-600 hover:text-slate-900"
                   >
                     ✕ Limpiar filtro de contratos
                   </Button>
                 )}
               </div>
             </div>
           )}
         </CardContent>
       </Card>

       {/* Summary Stats */}
       {stats && (
         <div>
           <div className="mb-4">
             <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               <ListChecks className="h-5 w-5 text-blue-600" />
               Resumen de Servicios
             </h2>
             <p className="text-sm text-slate-500 mt-1">
               Estadísticas de los servicios en el rango seleccionado
             </p>
           </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
             <Card className="hover:shadow-lg transition-shadow">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                   <ListChecks className="h-4 w-4 text-blue-600" />
                   Total de Servicios
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                 <p className="text-xs text-slate-500 mt-1">Todos los servicios en el rango</p>
               </CardContent>
             </Card>

             <Card className="hover:shadow-lg transition-shadow">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
                   <Clock className="h-4 w-4" />
                   Pendientes
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-yellow-600">
                   {stats.pending}
                 </div>
                 <p className="text-xs text-slate-500 mt-1">Sin confirmar aún</p>
               </CardContent>
             </Card>

             <Card className="hover:shadow-lg transition-shadow">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                   <CheckCircle2 className="h-4 w-4" />
                   Confirmados
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-green-600">
                   {stats.confirmed}
                 </div>
                 <p className="text-xs text-slate-500 mt-1">Confirmados y listos</p>
               </CardContent>
             </Card>

             <Card className="hover:shadow-lg transition-shadow">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-slate-600">
                   Esperado (Personas)
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-slate-900">{stats.totalExpected}</div>
                 <p className="text-xs text-slate-500 mt-1">Cantidad total esperada</p>
               </CardContent>
             </Card>

             <Card className="hover:shadow-lg transition-shadow">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-slate-600">
                   Servido (Personas)
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-slate-900">{stats.totalServed}</div>
                 <p className="text-xs text-slate-500 mt-1">Cantidad ya servida</p>
               </CardContent>
             </Card>
           </div>
         </div>
       )}

       {/* Service Days Table */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
             <div>
               <CardTitle className="flex items-center gap-2">
                 <CalendarIcon className="h-5 w-5 text-blue-600" />
                 Días de Servicio
               </CardTitle>
               <p className="text-sm text-slate-500 mt-2">
                 Detalle de cada servicio: fecha, cantidad esperada, cantidad servida y estado de confirmación
               </p>
             </div>
             {daysLoading && (
               <span className="text-sm text-slate-500 animate-pulse">Cargando...</span>
             )}
           </div>
         </CardHeader>
         <CardContent>
           {daysLoading ? (
             <div className="flex items-center justify-center h-32">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
             </div>
           ) : !filteredServiceDays || filteredServiceDays.length === 0 ? (
             <div className="text-center py-12 text-slate-500">
               <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
               <p className="text-lg font-semibold mb-2 text-slate-900">
                 No hay servicios para mostrar
               </p>
               <p className="text-sm text-slate-600">
                 Ajustá los filtros o el rango de fechas para ver más resultados
               </p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Contrato (Catering - Cliente)</TableHead>
                     <TableHead>Fecha del Servicio</TableHead>
                     <TableHead className="text-center">Esperado 👥</TableHead>
                     <TableHead className="text-center">Servido 👥</TableHead>
                     <TableHead className="text-center">Estado</TableHead>
                     <TableHead className="text-right">Acciones</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredServiceDays.map((day) => (
                     <TableRow key={day.id}>
                       <TableCell className="max-w-xs">
                         <div className="font-medium truncate text-slate-900">
                           {getContractName(day.contractId)}
                         </div>
                         <div className="text-xs text-slate-500 font-mono mt-1">
                           ID: {day.contractId.slice(0, 8)}...
                         </div>
                       </TableCell>
                       <TableCell className="text-slate-700">
                         {formatDate(day.serviceDate)}
                       </TableCell>
                       <TableCell className="text-center">
                         {day.expectedQuantity !== null ? (
                           <span className="font-semibold text-slate-900">
                             {day.expectedQuantity}
                           </span>
                         ) : (
                           <span className="text-slate-400">-</span>
                         )}
                       </TableCell>
                       <TableCell className="text-center">
                         {day.servedQuantity !== null ? (
                           <span className="font-semibold text-slate-900">
                             {day.servedQuantity}
                           </span>
                         ) : (
                           <span className="text-slate-400">-</span>
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
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() =>
                             router.push(
                               `/contracts/${day.contractId}/service-days`,
                             )
                           }
                           className="hover:bg-blue-50"
                         >
                           Ver Detalles
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           )}
         </CardContent>
       </Card>
    </div>
  );
}
