import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-formatter";
import type { KPIs } from "@/types/finance-metrics";

interface KPIsGridProps {
  kpis: KPIs;
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    change: number;
    isPositive: boolean;
  };
  secondary?: string;
}

function KPICard({ icon, label, value, trend, secondary }: KPICardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
          {trend && trend.change !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.change)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-1 font-mono">
          {value}
        </div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {secondary && (
          <p className="text-xs text-slate-400 mt-1 font-mono">{secondary}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function KPIsGrid({ kpis }: KPIsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Cost per Person */}
      <KPICard
        icon={<DollarSign className="h-5 w-5 text-blue-600" />}
        label="Costo por Persona / Mes"
        value={formatCurrency(kpis.costPerPerson.current)}
        trend={{
          change: kpis.costPerPerson.change,
          isPositive: kpis.costPerPerson.change < 0,
        }}
        secondary={
          kpis.costPerPerson.previousMonth > 0
            ? `Anterior: ${formatCurrency(kpis.costPerPerson.previousMonth)}`
            : undefined
        }
      />

      {/* Utilization Rate */}
      <KPICard
        icon={<Users className="h-5 w-5 text-emerald-600" />}
        label="Tasa de Utilización"
        value={`${kpis.utilizationRate.current}%`}
        trend={{
          change: kpis.utilizationRate.change,
          isPositive: kpis.utilizationRate.change > 0,
        }}
        secondary={
          kpis.utilizationRate.previousMonth > 0
            ? `Anterior: ${kpis.utilizationRate.previousMonth}%`
            : undefined
        }
      />

      {/* Contracts with Deviation */}
      <KPICard
        icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
        label="Contratos con Desvío"
        value={kpis.contractsWithDeviation}
        secondary="Fuera de proyección (>10%)"
      />

      {/* Upcoming Services */}
      <KPICard
        icon={<Calendar className="h-5 w-5 text-violet-600" />}
        label="Servicios Próximos"
        value={kpis.upcomingServicesWeek.count}
        secondary={formatCurrency(kpis.upcomingServicesWeek.estimatedCost)}
      />
    </div>
  );
}
