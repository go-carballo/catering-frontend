import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DeviationAlertProps {
  count: number;
  onViewContracts: () => void;
}

export function DeviationAlert({
  count,
  onViewContracts,
}: DeviationAlertProps) {
  if (count === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">
              Atención Requerida
            </h3>
            <p className="text-xs text-amber-800 mb-3">
              Tenés <span className="font-bold">{count}</span>{" "}
              contrato(s) con más de 10% de desvío entre lo presupuestado y lo
              consumido. Revisalos para optimizar costos.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white hover:bg-amber-50 border-amber-200 text-amber-900"
              onClick={onViewContracts}
            >
              Revisar Contratos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
