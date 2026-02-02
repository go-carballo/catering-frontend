import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { WeeklyReport } from "@/services/reports.service";
import type { Contract } from "@/types/contract";

/**
 * Generate a professional PDF report for a weekly catering service report
 */
export function generateWeeklyReportPDF(
  report: WeeklyReport,
  contract: Contract,
  companyName: string,
): jsPDF {
  const doc = new jsPDF();

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Colors
  const primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
  const textColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const mutedColor: [number, number, number] = [107, 114, 128]; // Gray-500

  let yPos = margin;

  // === HEADER ===
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("REPORTE SEMANAL", margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(companyName, margin, 28);

  yPos = 50;

  // === CONTRACT INFO ===
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Contrato", margin, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const contractInfo = [
    `Contrato ID: ${contract.id.slice(0, 16)}...`,
    `Catering: ${contract.cateringName || "N/A"}`,
    `Cliente: ${contract.clientName || "N/A"}`,
    `Precio por Servicio: $${contract.pricePerService.toFixed(2)}`,
  ];

  contractInfo.forEach((line) => {
    doc.setTextColor(...mutedColor);
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  yPos += 5;

  // === DATE RANGE ===
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Período del Reporte", margin, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);

  const weekStartDate = new Date(report.weekStart);
  const weekEndDate = new Date(report.weekEnd);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  doc.text(
    `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`,
    margin,
    yPos,
  );

  yPos += 12;

  // === TABLE ===
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Detalle de Servicios", margin, yPos);

  yPos += 5;

  // Check if report has entries
  if (!report.entries || report.entries.length === 0) {
    throw new Error("No hay datos para generar el reporte");
  }

  const tableData: any[] = report.entries.map((entry) => {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
    });

    return [
      formattedDate,
      entry.dayOfWeek,
      entry.expectedQuantity?.toString() || "-",
      entry.servedQuantity?.toString() || "-",
      entry.difference !== null
        ? (entry.difference > 0 ? "+" : "") + entry.difference
        : "-",
      entry.status === "CONFIRMED" ? "Confirmado" : "Pendiente",
    ];
  });

  // Add totals row
  tableData.push([
    { content: "TOTALES", colSpan: 2, styles: { fontStyle: "bold" } },
    {
      content: report.totals.totalExpected.toString(),
      styles: { fontStyle: "bold" },
    },
    {
      content: report.totals.totalServed.toString(),
      styles: { fontStyle: "bold" },
    },
    {
      content:
        (report.totals.totalDifference > 0 ? "+" : "") +
        report.totals.totalDifference,
      styles: { fontStyle: "bold" },
    },
    "",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Fecha", "Día", "Esperado", "Servido", "Diferencia", "Estado"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      textColor: textColor,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Gray-50
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "center", cellWidth: 25 },
      4: { halign: "center", cellWidth: 25 },
      5: { halign: "center", cellWidth: 35 },
    },
    didParseCell: (data) => {
      // Color the difference column
      if (data.column.index === 4 && data.section === "body") {
        const value = data.cell.raw as string;
        if (typeof value === "string") {
          if (value.startsWith("+")) {
            data.cell.styles.textColor = [22, 163, 74]; // Green-600
          } else if (value.startsWith("-") && value !== "-") {
            data.cell.styles.textColor = [220, 38, 38]; // Red-600
          }
        }
      }

      // Highlight totals row
      if (
        data.row.index === tableData.length - 1 &&
        data.section === "body"
      ) {
        data.cell.styles.fillColor = [243, 244, 246]; // Gray-100
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Get Y position after table
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // === SUMMARY CARDS ===
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen", margin, yPos);

  yPos += 8;

  const summaryBoxWidth = (pageWidth - margin * 2 - 10) / 2;
  const summaryBoxHeight = 20;
  const summaryBoxGap = 10;

  // Summary data
  const summaryItems = [
    {
      label: "Total Esperado",
      value: report.totals.totalExpected.toString(),
      color: primaryColor,
    },
    {
      label: "Total Servido",
      value: report.totals.totalServed.toString(),
      color: primaryColor,
    },
    {
      label: "Diferencia",
      value:
        (report.totals.totalDifference > 0 ? "+" : "") +
        report.totals.totalDifference,
      color:
        report.totals.totalDifference < 0
          ? ([220, 38, 38] as [number, number, number]) // Red
          : report.totals.totalDifference > 0
            ? ([22, 163, 74] as [number, number, number]) // Green
            : primaryColor,
    },
    {
      label: "Monto Estimado",
      value: `$${(report.totals.totalServed * contract.pricePerService).toFixed(2)}`,
      color: [34, 197, 94] as [number, number, number], // Green-500
    },
  ];

  summaryItems.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = margin + col * (summaryBoxWidth + summaryBoxGap);
    const y = yPos + row * (summaryBoxHeight + summaryBoxGap);

    // Box
    doc.setFillColor(249, 250, 251); // Gray-50
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.rect(x, y, summaryBoxWidth, summaryBoxHeight, "FD");

    // Label
    doc.setTextColor(...mutedColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, x + 5, y + 7);

    // Value
    doc.setTextColor(...item.color);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, x + 5, y + 16);
  });

  yPos += 2 * (summaryBoxHeight + summaryBoxGap) + 10;

  // === FOOTER ===
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.setFont("helvetica", "normal");

  const generatedDate = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.text(`Generado: ${generatedDate}`, margin, footerY);
  doc.text(
    `Página 1 de 1`,
    pageWidth - margin,
    footerY,
    { align: "right" },
  );

  return doc;
}
