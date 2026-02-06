"use client";

import { useRouter } from "next/navigation";
import { useContracts } from "@/hooks";
import { Calendar, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/types/contract";

export function CateringHome() {
  const router = useRouter();
  const { data: contracts = [] } = useContracts();

  // Calculate metrics
  const activeContracts = contracts.filter(c => c.status === "ACTIVE").length;
  const pausedContracts = contracts.filter(c => c.status === "PAUSED").length;
  const totalCapacity = contracts
    .filter(c => c.status === "ACTIVE")
    .reduce((sum, c) => sum + c.maxDailyQuantity, 0);

  // Get upcoming services this week
  const today = new Date();
  const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingServices = contracts
    .filter(c => c.status === "ACTIVE")
    .reduce((sum, c) => {
      const serviceDaysThisWeek = c.serviceDays.filter(day => {
        const nextDate = new Date(today);
        nextDate.setDate(nextDate.getDate() + ((day - nextDate.getDay() + 7) % 7 || 7));
        return nextDate <= weekEnd;
      }).length;
      return sum + (serviceDaysThisWeek * c.maxDailyQuantity);
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Panel de Catering
        </h1>
        <p className="text-slate-500 mt-1">
          Resumen operacional y gestión de contratos
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Contracts */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              Contratos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeContracts}</div>
            <p className="text-xs text-slate-500 mt-1">
              {pausedContracts > 0 && `${pausedContracts} pausados`}
            </p>
          </CardContent>
        </Card>

        {/* Total Capacity */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-600" />
              Capacidad Diaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalCapacity}</div>
            <p className="text-xs text-slate-500 mt-1">servicios máximos/día</p>
          </CardContent>
        </Card>

        {/* Upcoming This Week */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              Próximos Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{upcomingServices}</div>
            <p className="text-xs text-slate-500 mt-1">esta semana</p>
          </CardContent>
        </Card>

        {/* Contracts Needing Attention */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Pausados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pausedContracts}</div>
            <p className="text-xs text-slate-500 mt-1">requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {activeContracts === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Sin contratos activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-blue-800">
              Necesitás contratos activos para comenzar a gestionar servicios.
            </p>
            <Button
              onClick={() => router.push("/contracts")}
              className="w-full"
            >
              Ver Contratos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Contracts Summary */}
      {activeContracts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contratos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contracts
                .filter(c => c.status === "ACTIVE")
                .slice(0, 5)
                .map(contract => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/contracts/${contract.id}/service-days`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {contract.id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {contract.minDailyQuantity} - {contract.maxDailyQuantity} servicios/día
                      </p>
                    </div>
                    <Badge variant="outline" className="text-teal-600 border-teal-200">
                      Activo
                    </Badge>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/contracts")}
              className="w-full mt-4"
            >
              Ver todos los contratos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
