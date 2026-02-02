"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";
import {
  useContracts,
  useCaterings,
  useClients,
  useTodayServiceDays,
} from "@/hooks";
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
import {
  FileText,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { company } = useAuth();

  // Fetch data
  const { data: contracts, isLoading: contractsLoading } = useContracts();
  const { data: caterings, isLoading: cateringsLoading } = useCaterings();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: todayServices, isLoading: servicesLoading } =
    useTodayServiceDays(contracts);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!contracts) return null;

    const activeContracts = contracts.filter((c) => c.status === "ACTIVE");
    const pausedContracts = contracts.filter((c) => c.status === "PAUSED");
    const totalCompanies = (caterings?.length || 0) + (clients?.length || 0);
    const pendingServices = todayServices?.filter(
      (s) => s.status === "PENDING",
    ).length || 0;
    const confirmedServices = todayServices?.filter(
      (s) => s.status === "CONFIRMED",
    ).length || 0;

    return {
      activeContracts: activeContracts.length,
      pausedContracts: pausedContracts.length,
      totalCompanies,
      pendingServices,
      confirmedServices,
      totalServicesForToday: todayServices?.length || 0,
    };
  }, [contracts, caterings, clients, todayServices]);

  const isLoading =
    contractsLoading || cateringsLoading || clientsLoading || servicesLoading;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  if (isLoading) {
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Bienvenido, {company?.name} -{" "}
          {company?.companyType === "CATERING" ? "Catering" : "Cliente"}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activeContracts ?? "-"}
            </div>
            {metrics && metrics.pausedContracts > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {metrics.pausedContracts} pausados
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Servicios Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalServicesForToday ?? "-"}
            </div>
            {metrics && metrics.totalServicesForToday > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {metrics.pendingServices} pendientes
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalCompanies ?? "-"}
            </div>
            {metrics && (
              <p className="text-xs text-gray-500 mt-1">
                {caterings?.length || 0} caterings, {clients?.length || 0}{" "}
                clientes
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirmados Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.confirmedServices ?? "-"}
            </div>
            {metrics && metrics.totalServicesForToday > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                de {metrics.totalServicesForToday} totales
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Services */}
      {todayServices && todayServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Servicios de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                {todayServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-mono text-sm">
                      {service.contractId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{formatDate(service.serviceDate)}</TableCell>
                    <TableCell className="text-center">
                      {service.expectedQuantity ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {service.servedQuantity ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          service.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {service.status === "CONFIRMED"
                          ? "Confirmado"
                          : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/contracts/${service.contractId}/service-days`,
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
          </CardContent>
        </Card>
      )}

      {/* Paused Contracts Alert */}
      {metrics && metrics.pausedContracts > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Contratos que Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              Tenés {metrics.pausedContracts} contrato(s) pausado(s). Revisalos
              para reactivarlos o gestionarlos según sea necesario.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/contracts")}
            >
              Ver Contratos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {metrics &&
        metrics.activeContracts === 0 &&
        metrics.pausedContracts === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay contratos activos
                </h3>
                <p className="text-gray-500 mb-4">
                  Comenzá creando tu primer contrato para gestionar servicios de
                  catering.
                </p>
                <Button onClick={() => router.push("/contracts")}>
                  Crear Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
