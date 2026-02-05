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
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
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

  // Mock budget data (TODO: fetch from backend)
  const budgetData = {
    used: 450000,
    total: 600000,
    currency: "ARS",
  };
  const budgetPercentage = (budgetData.used / budgetData.total) * 100;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Bienvenido, {company?.name}
              </h1>
              <p className="text-blue-100 text-lg">
                {company?.companyType === "CATERING" 
                  ? "Panel de Control de Catering" 
                  : "Panel de Gestión de Servicios"}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Mes actual</p>
                <p className="text-2xl font-bold">
                  {new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-100 mb-1">Presupuesto Mensual</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">
                    ${budgetData.used.toLocaleString("es-AR")}
                  </span>
                  <span className="text-blue-200">
                    / ${budgetData.total.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{budgetPercentage.toFixed(0)}%</div>
                <p className="text-xs text-blue-200">utilizado</p>
              </div>
            </div>
            <Progress 
              value={budgetPercentage} 
              className="h-2 bg-white/20"
            />
          </div>
        </div>
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Metrics Cards - Linear Style with Top Border */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Contratos Activos */}
        <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              {metrics && metrics.pausedContracts > 0 && (
                <Badge variant="outline" className="text-xs">
                  {metrics.pausedContracts} pausados
                </Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metrics?.activeContracts ?? "-"}
            </div>
            <p className="text-sm font-medium text-slate-500">Contratos Activos</p>
          </CardContent>
        </Card>

        {/* Card 2: Servicios Hoy */}
        <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              {metrics && metrics.totalServicesForToday > 0 && (
                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
                  {metrics.pendingServices} pendientes
                </Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metrics?.totalServicesForToday ?? "-"}
            </div>
            <p className="text-sm font-medium text-slate-500">Servicios Hoy</p>
          </CardContent>
        </Card>

        {/* Card 3: Empresas */}
        <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-violet-50 rounded-lg">
                <Building2 className="h-5 w-5 text-violet-600" />
              </div>
              {metrics && (
                <Badge variant="outline" className="text-xs">
                  {caterings?.length || 0} cat.
                </Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metrics?.totalCompanies ?? "-"}
            </div>
            <p className="text-sm font-medium text-slate-500">Empresas Totales</p>
          </CardContent>
        </Card>

        {/* Card 4: Confirmados Hoy */}
        <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-amber-600" />
              </div>
              {metrics && metrics.totalServicesForToday > 0 && (
                <TrendingUp className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metrics?.confirmedServices ?? "-"}
            </div>
            <p className="text-sm font-medium text-slate-500">
              {metrics?.totalServicesForToday 
                ? `de ${metrics.totalServicesForToday} confirmados`
                : "Confirmados Hoy"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Services */}
      {todayServices && todayServices.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                Servicios de Hoy
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/service-days")}
              >
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Contrato</TableHead>
                    <TableHead className="font-semibold">Fecha</TableHead>
                    <TableHead className="text-center font-semibold">Esperado</TableHead>
                    <TableHead className="text-center font-semibold">Servido</TableHead>
                    <TableHead className="text-center font-semibold">Estado</TableHead>
                    <TableHead className="text-right font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayServices.map((service, idx) => (
                    <TableRow 
                      key={service.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {idx + 1}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-medium">
                            {service.contractId.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-700">
                          {formatDate(service.serviceDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-12 h-8 rounded-md bg-blue-50 text-blue-700 font-semibold text-sm">
                          {service.expectedQuantity ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-12 h-8 rounded-md bg-green-50 text-green-700 font-semibold text-sm">
                          {service.servedQuantity ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={service.status === "CONFIRMED" ? "default" : "secondary"}
                          className={
                            service.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
                          }
                        >
                          {service.status === "CONFIRMED" ? "✓ Confirmado" : "⏳ Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50 hover:text-blue-600"
                          onClick={() =>
                            router.push(
                              `/contracts/${service.contractId}/service-days`,
                            )
                          }
                        >
                          Ver Detalles →
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paused Contracts Alert */}
      {metrics && metrics.pausedContracts > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Contratos que Requieren Atención
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Tenés <span className="font-bold">{metrics.pausedContracts}</span> contrato(s) pausado(s). 
                  Revisalos para reactivarlos o gestionarlos según sea necesario.
                </p>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-900"
                  onClick={() => router.push("/contracts")}
                >
                  Ver Contratos →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {metrics &&
        metrics.activeContracts === 0 &&
        metrics.pausedContracts === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  No hay contratos activos
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Comenzá creando tu primer contrato para gestionar servicios de
                  catering y llevar el control de tus operaciones.
                </p>
                <Button 
                  size="lg"
                  onClick={() => router.push("/contracts")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  + Crear Primer Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
