import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Hero card skeleton */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-64" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex gap-6 pt-2 border-t border-slate-100">
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
