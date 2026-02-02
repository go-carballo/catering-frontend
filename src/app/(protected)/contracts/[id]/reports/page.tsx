"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useContract } from "@/hooks/use-contracts";
import { reportsService, WeeklyReport } from "@/services/reports.service";
import { getWeekStart, formatDateParam } from "@/services/service-days.service";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowLeft, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { generateWeeklyReportPDF } from "@/lib/pdf-generator";
import { useAuth } from "@/providers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportsPage({ params }: PageProps) {
  const { id: contractId } = use(params);
  const router = useRouter();
  const { company } = useAuth();

  // Week navigation state
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => {
    const base = new Date();
    base.setDate(base.getDate() + weekOffset * 7);
    return formatDateParam(getWeekStart(base));
  }, [weekOffset]);

  // Data fetching
  const { data: contract, isLoading: contractLoading } =
    useContract(contractId);
  const {
    data: report,
    isLoading: reportLoading,
    error,
  } = useQuery({
    queryKey: ["weeklyReport", contractId, weekStart],
    queryFn: () => reportsService.getWeeklyReport(contractId, weekStart),
    enabled: !!contractId,
  });

  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadCsv = async () => {
    setDownloading(true);
    try {
      const blobUrl = await reportsService.downloadWeeklyCsv(
        contractId,
        weekStart,
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `reporte-${contractId.slice(0, 8)}-${weekStart}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Reporte CSV descargado");
    } catch (err) {
      toast.error("Error al descargar el reporte CSV");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!report || !contract || !company) {
      toast.error("No hay datos para generar el PDF");
      return;
    }

    if (!report.entries || report.entries.length === 0) {
      toast.error("No hay servicios en este período para generar el reporte");
      return;
    }

    setDownloadingPdf(true);
    try {
      const pdf = generateWeeklyReportPDF(report, contract, company.name);
      pdf.save(`reporte-${contractId.slice(0, 8)}-${weekStart}.pdf`);
      toast.success("Reporte PDF descargado");
    } catch (err) {
      console.error("Error generating PDF:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      toast.error(`Error al generar el PDF: ${errorMessage}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const isLoading = contractLoading || reportLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center text-red-600 py-8">
        Contrato no encontrado
      </div>
    );
  }

  const weekStartDate = new Date(weekStart);
  const weekLabel = weekStartDate.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/contracts")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Reporte Semanal</h1>
          <p className="text-gray-500">
            Contrato: {contractId.slice(0, 8)}... | $
            {contract.pricePerService.toFixed(2)}/servicio
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={
              downloadingPdf ||
              !report ||
              !report.entries ||
              report.entries.length === 0
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            {downloadingPdf ? "Generando..." : "Descargar PDF"}
          </Button>
          <Button
            onClick={handleDownloadCsv}
            disabled={
              downloading || !report || !report.entries || report.entries.length === 0
            }
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? "Descargando..." : "Descargar CSV"}
          </Button>
        </div>
      </div>

      {/* Week Navigator */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Semana del {weekLabel}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset((w) => w - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(0)}
                disabled={weekOffset === 0}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset((w) => w + 1)}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-red-500">
              Error al cargar el reporte
            </div>
          ) : !report || !report.entries || report.entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos para esta semana
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Día</TableHead>
                  <TableHead className="text-center">Esperado</TableHead>
                  <TableHead className="text-center">Servido</TableHead>
                  <TableHead className="text-center">Diferencia</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.entries.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {new Date(entry.date).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell>{entry.dayOfWeek}</TableCell>
                    <TableCell className="text-center">
                      {entry.expectedQuantity ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.servedQuantity ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.difference !== null ? (
                        <span
                          className={
                            entry.difference < 0
                              ? "text-red-600"
                              : entry.difference > 0
                                ? "text-green-600"
                                : ""
                          }
                        >
                          {entry.difference > 0 ? "+" : ""}
                          {entry.difference}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          entry.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry.status === "CONFIRMED"
                          ? "Confirmado"
                          : "Pendiente"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="font-bold bg-gray-50">
                  <TableCell colSpan={2}>TOTALES</TableCell>
                  <TableCell className="text-center">
                    {report.totals.totalExpected}
                  </TableCell>
                  <TableCell className="text-center">
                    {report.totals.totalServed}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        report.totals.totalDifference < 0
                          ? "text-red-600"
                          : report.totals.totalDifference > 0
                            ? "text-green-600"
                            : ""
                      }
                    >
                      {report.totals.totalDifference > 0 ? "+" : ""}
                      {report.totals.totalDifference}
                    </span>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {report && report.totals && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Total Esperado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {report.totals.totalExpected}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Total Servido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{report.totals.totalServed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Diferencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  report.totals.totalDifference < 0
                    ? "text-red-600"
                    : report.totals.totalDifference > 0
                      ? "text-green-600"
                      : ""
                }`}
              >
                {report.totals.totalDifference > 0 ? "+" : ""}
                {report.totals.totalDifference}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Monto Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                $
                {(report.totals.totalServed * contract.pricePerService).toFixed(
                  2,
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
