import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = <FileText className="h-10 w-10 text-blue-600" />,
}: EmptyStateProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
          {actionLabel && onAction && (
            <Button
              size="lg"
              onClick={onAction}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
