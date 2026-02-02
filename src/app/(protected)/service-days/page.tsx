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
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Desde</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hasta</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-0">.</label>
              <div className="flex gap-2">
                <Button onClick={handleApplyDateRange} className="flex-1">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Aplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetToCurrentWeek}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Semana Actual
                </Button>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ServiceDayStatus | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDING">Pendientes</SelectItem>
                <SelectItem value="CONFIRMED">Confirmados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contract Filter */}
          {contracts && contracts.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Contratos ({selectedContractIds.length > 0 ? selectedContractIds.length : "Todos"})
              </label>
              <div className="flex flex-wrap gap-2">
                {contracts.map((contract) => (
                  <Badge
                    key={contract.id}
                    variant={
                      selectedContractIds.includes(contract.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleContractFilter(contract.id)}
                  >
                    {contract.id.slice(0, 8)}...
                  </Badge>
                ))}
                {selectedContractIds.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedContractIds([])}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.confirmed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Esperado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExpected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Servido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServed}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Days Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Días de Servicio
            {daysLoading && (
              <span className="ml-2 text-sm text-gray-500">Cargando...</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {daysLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : !filteredServiceDays || filteredServiceDays.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">
                No hay servicios para mostrar
              </p>
              <p className="text-sm">
                Ajustá los filtros o el rango de fechas para ver más resultados
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Esperado</TableHead>
                    <TableHead className="text-center">Servido</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServiceDays.map((day) => (
                    <TableRow key={day.id}>
                      <TableCell className="max-w-xs">
                        <div className="font-medium truncate">
                          {getContractName(day.contractId)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {day.contractId.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(day.serviceDate)}</TableCell>
                      <TableCell className="text-center">
                        {day.expectedQuantity !== null ? (
                          <span className="font-semibold">
                            {day.expectedQuantity}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
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
