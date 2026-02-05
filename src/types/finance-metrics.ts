export interface BudgetMetrics {
  consumed: number;
  estimated: number;
  projectedEndOfMonth: number;
  previousMonth: number;
}

export interface MetricChange {
  current: number;
  previousMonth: number;
  change: number;
}

export interface UpcomingServices {
  count: number;
  estimatedCost: number;
}

export interface KPIs {
  costPerPerson: MetricChange;
  utilizationRate: MetricChange;
  contractsWithDeviation: number;
  upcomingServicesWeek: UpcomingServices;
}

export interface RecentService {
  id: string;
  date: string;
  contractId: string;
  cateringCompanyName: string;
  clientCompanyName: string;
  expected: number | null;
  actual: number | null;
  deviation: number | null;
  cost: number | null;
  status: string;
}

export interface FinanceMetrics {
  budget: BudgetMetrics;
  kpis: KPIs;
  recentServices: RecentService[];
}
