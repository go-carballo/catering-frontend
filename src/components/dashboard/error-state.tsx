import { AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  icon = <AlertTriangle className="h-12 w-12 text-red-500" />,
}: ErrorStateProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="mb-4">{icon}</div>
          <p className="text-lg font-semibold text-gray-900 mb-2 text-center">
            {title}
          </p>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-md">
            {description}
          </p>
          {actionLabel && onAction && (
            <Button onClick={onAction} variant="outline">
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
