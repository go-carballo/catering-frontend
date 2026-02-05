import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-formatter";
import { formatDateShort } from "@/lib/date-formatter";
import type { RecentService } from "@/types/finance-metrics";

interface RecentServicesTableProps {
  services: RecentService[];
  onViewDetails: (contractId: string) => void;
}

export function RecentServicesTable({
  services,
  onViewDetails,
}: RecentServicesTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">
            Registro de Consumos
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onViewDetails("all")}
          >
            Ver Histórico Completo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">
                  Fecha
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Proveedor
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-700">
                  Presupuestado
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-700">
                  Real
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-700">
                  Desvío
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Costo
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-700">
                  Estado
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const isPositiveDeviation =
                  service.deviation !== null && service.deviation > 0;
                const hasDeviation =
                  service.deviation !== null && service.deviation !== 0;

                return (
                  <TableRow
                    key={service.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {formatDateShort(service.date)}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {service.cateringCompanyName}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-slate-50 text-slate-700 font-semibold text-sm font-mono">
                        {service.expected ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md font-semibold text-sm font-mono ${
                          isPositiveDeviation
                            ? "bg-amber-50 text-amber-700"
                            : hasDeviation
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {service.actual ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {hasDeviation ? (
                        <div className="flex items-center justify-center gap-1">
                          {isPositiveDeviation ? (
                            <ArrowUpRight className="h-3 w-3 text-amber-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-green-600" />
                          )}
                          <span
                            className={`text-sm font-semibold font-mono ${
                              isPositiveDeviation
                                ? "text-amber-700"
                                : "text-green-700"
                            }`}
                          >
                            {isPositiveDeviation ? "+" : ""}
                            {service.deviation}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 font-mono">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-slate-900 font-mono">
                        {service.cost !== null
                          ? formatCurrency(service.cost)
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {service.status === "CONFIRMED" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 font-medium"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Facturado
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 font-medium"
                        >
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs hover:bg-slate-100 hover:text-slate-600"
                        onClick={() =>
                          onViewDetails(service.contractId)
                        }
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
