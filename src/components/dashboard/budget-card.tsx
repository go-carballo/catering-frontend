import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/currency-formatter";
import type { BudgetMetrics } from "@/types/finance-metrics";

interface BudgetCardProps {
  budget: BudgetMetrics;
  budgetPercentage: number;
  projectedPercentage: number;
  savingsVsPrevious: number;
  savingsPercentage: number;
  isOverBudget: boolean;
}

export function BudgetCard({
  budget,
  budgetPercentage,
  projectedPercentage,
  savingsVsPrevious,
  savingsPercentage,
  isOverBudget,
}: BudgetCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Estado del Presupuesto Mensual
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900 font-mono">
                  {formatCurrency(budget.consumed)}
                </span>
                {budget.estimated > 0 && (
                  <span className="text-lg text-slate-500 font-mono">
                    / {formatCurrency(budget.estimated)}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className="ml-2 font-mono text-slate-700 border-slate-300"
                >
                  {budgetPercentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">
                Proyección fin de mes
              </p>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {formatCurrency(budget.projectedEndOfMonth)}
                </span>
                {isOverBudget ? (
                  <Badge variant="destructive" className="font-mono text-xs">
                    ⚠️ Sobre estimado
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 font-mono text-xs"
                  >
                    ✓ Dentro del estimado
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Progress
            value={budgetPercentage}
            className="h-2 bg-slate-100"
          />

          {/* Comparison with previous month */}
          {budget.previousMonth > 0 && (
            <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {savingsVsPrevious > 0 ? (
                  <ArrowDownRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-slate-600">
                  {savingsVsPrevious > 0 ? "Ahorro" : "Incremento"} vs. mes
                  anterior:
                </span>
                <span
                  className={`text-sm font-semibold font-mono ${
                    savingsVsPrevious > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(savingsVsPrevious))} (
                  {Math.abs(savingsPercentage).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
