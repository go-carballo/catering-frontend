"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: send to error reporting service (Sentry, etc.)
    console.error("Uncaught error:", error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-red-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Algo salió mal
              </h1>
              <p className="text-gray-600">
                Ocurrió un error inesperado. Intentá nuevamente o contactá al
                soporte si el problema persiste.
              </p>
            </div>
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Intentar nuevamente
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
