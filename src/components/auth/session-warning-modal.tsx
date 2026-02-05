"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SessionTimeoutState } from "@/hooks/use-session-timeout";

interface SessionWarningModalProps extends SessionTimeoutState {}

/**
 * Modal that appears when session is about to timeout.
 * Allows user to extend session or logout.
 */
export function SessionWarningModal({
  showWarning,
  timeUntilLogout,
  extendSession,
}: SessionWarningModalProps) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMinutes(Math.floor(timeUntilLogout / 60));
    setSeconds(timeUntilLogout % 60);
  }, [timeUntilLogout]);

  const handleStayLoggedIn = async () => {
    await extendSession();
  };

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Tu sesión está por expirar</AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="space-y-4">
          <p>
            Por razones de seguridad, tu sesión se cerrará automáticamente si
            permaneces inactivo.
          </p>

          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900">
            <Clock className="h-4 w-4" />
            <span>
              Tiempo restante: {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Haz clic en "Continuar conectado" para extender tu sesión.
          </p>
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 text-gray-900 hover:bg-gray-300">
            Cerrar sesión
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStayLoggedIn}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Continuar conectado
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
