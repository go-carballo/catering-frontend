"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServiceDaysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Servicios</h1>
        <p className="text-gray-500">Gestión de días de servicio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Días de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Funcionalidad en desarrollo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
