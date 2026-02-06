"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";
import { useFinanceMetrics } from "@/hooks";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BudgetCard } from "@/components/dashboard/budget-card";
import { KPIsGrid } from "@/components/dashboard/kpis-grid";
import { RecentServicesTable } from "@/components/dashboard/recent-services-table";
import { DeviationAlert } from "@/components/dashboard/deviation-alert";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { DashboardLoadingSkeleton } from "@/components/dashboard/loading-skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const { company } = useAuth();
  const { data: financeData, isLoading, error } = useFinanceMetrics();

  // Calculate derived metrics for budget analysis
  const budgetMetrics = useMemo(() => {
    if (!financeData) return null;

    const { budget } = financeData;
    const budgetPercentage =
      budget.estimated > 0 ? (budget.consumed / budget.estimated) * 100 : 0;
    const savingsVsPrevious = budget.previousMonth - budget.consumed;
    const savingsPercentage =
      budget.previousMonth > 0
        ? (savingsVsPrevious / budget.previousMonth) * 100
        : 0;
    const isOverBudget =
      budget.estimated > 0 && budget.projectedEndOfMonth > budget.estimated;

    return {
      budgetPercentage,
      savingsVsPrevious,
      savingsPercentage,
      isOverBudget,
    };
  }, [financeData]);

  // Handle loading state
  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <ErrorState
        title="Error al cargar métricas"
        description="No se pudieron obtener los datos financieros. Por favor, intenta más tarde."
        actionLabel="Reintentar"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Validate data exists
  if (!financeData || !budgetMetrics) {
    return null;
  }

  const { budget, kpis, recentServices } = financeData;
  const hasNoData =
    budget.consumed === 0 &&
    budget.estimated === 0 &&
    recentServices.length === 0;

   // Handle empty state - no contracts
   if (hasNoData) {
     return (
       <div className="space-y-6">
         <Breadcrumbs />
         <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Beneficio Corporativo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control financiero y auditoría de servicios de catering
          </p>
        </div>

        <EmptyState
          title="No hay contratos activos"
          description="Comenzá creando tu primer contrato para gestionar servicios de catering y llevar el control de tus operaciones."
          actionLabel="+ Crear Primer Contrato"
          onAction={() => router.push("/contracts")}
        />
      </div>
    );
  }

   // Main dashboard view with data
   return (
     <div className="space-y-6">
       <Breadcrumbs />
       {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Gestión de Beneficio Corporativo
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Control financiero y auditoría de servicios de catering
        </p>
      </div>

      {/* Budget Card - Hero Section */}
      <BudgetCard
        budget={budget}
        budgetPercentage={budgetMetrics.budgetPercentage}
        projectedPercentage={0} // Not used in current design
        savingsVsPrevious={budgetMetrics.savingsVsPrevious}
        savingsPercentage={budgetMetrics.savingsPercentage}
        isOverBudget={budgetMetrics.isOverBudget}
      />

      {/* KPIs Grid */}
      <KPIsGrid kpis={kpis} />

      {/* Deviation Alert - Only show if there are deviations */}
      {kpis.contractsWithDeviation > 0 && (
        <DeviationAlert
          count={kpis.contractsWithDeviation}
          onViewContracts={() => router.push("/contracts")}
        />
      )}

      {/* Recent Services Table */}
      {recentServices.length > 0 && (
        <RecentServicesTable
          services={recentServices}
          onViewDetails={(contractId) => {
            if (contractId === "all") {
              router.push("/service-days");
            } else {
              router.push(`/contracts/${contractId}/service-days`);
            }
          }}
        />
      )}
    </div>
  );
}
