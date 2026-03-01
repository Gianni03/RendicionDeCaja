import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BillCount, DayEntry } from '../../types';
import {
  calcComparison,
  calcTotalContado,
  calcTotalEfectivoEsperado,
  calcTotalPosnet,
  formatDateShort,
} from '../../utils/calculations';
import { useRendicionStore } from '../../store/useRendicionStore';
import styles from './PDFGenerator.module.css';

// ─── PDF Builder ─────────────────────────────────────────────────────────────

function buildPDF(days: DayEntry[], bills: BillCount[]): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const formatNum = (n: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(n);

  // ─── Header ───────────────────────────────────────────────────────────

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RENDICIÓN DE CAJA', pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Date range subtitle
  if (days.length > 0) {
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    const from = formatDateShort(sorted[0].date);
    const to = formatDateShort(sorted[sorted.length - 1].date);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const subtitle =
      days.length === 1 ? `Período: ${from}` : `Período: ${from} — ${to}`;
    doc.text(subtitle, pageWidth / 2, y, { align: 'center' });
    y += 4;
  }

  // Print timestamp
  doc.setFontSize(8);
  doc.setTextColor(120);
  const now = new Date();
  doc.text(
    `Generado: ${now.toLocaleDateString('es-AR')} ${now.toLocaleTimeString('es-AR')}`,
    pageWidth / 2,
    y,
    { align: 'center' },
  );
  doc.setTextColor(0);
  y += 10;

  // Separator line
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ─── Section 1: Rendición por Día ────────────────────────────────────

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. RENDICIÓN POR DÍA', margin, y);
  y += 6;

  if (days.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Sin días cargados.', margin, y);
    doc.setTextColor(0);
    y += 10;
  } else {
    const dayRows = days
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => [
        formatDateShort(d.date),
        formatNum(d.totalFacturado),
        formatNum(d.posnet),
        formatNum(d.efectivoDia),
      ]);

    const totalFacturado = days.reduce((s, d) => s + d.totalFacturado, 0);
    const totalPosnet = calcTotalPosnet(days);
    const totalEfectivo = calcTotalEfectivoEsperado(days);

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Fecha', 'Total Facturado', 'POSNET', 'Efectivo']],
      body: dayRows,
      foot: [
        [
          'TOTALES',
          formatNum(totalFacturado),
          formatNum(totalPosnet),
          formatNum(totalEfectivo),
        ],
      ],
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [30, 30, 30],
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold' },
      },
      theme: 'grid',
      tableWidth: contentWidth,
    });

    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;
  }

  // ─── Section 2: Totales Acumulados ───────────────────────────────────

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. TOTALES ACUMULADOS', margin, y);
  y += 6;

  const totalPosnet = calcTotalPosnet(days);
  const totalEfesperado = calcTotalEfectivoEsperado(days);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ['Total POSNET acumulado', formatNum(totalPosnet)],
      ['Total efectivo esperado', formatNum(totalEfesperado)],
    ],
    bodyStyles: { fontSize: 10, textColor: [30, 30, 30] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    theme: 'grid',
    tableWidth: contentWidth,
  });

  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;

  // ─── Section 3: Contador de Billetes ─────────────────────────────────

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. CONTADOR DE BILLETES', margin, y);
  y += 6;

  const formatDenom = (d: number) => `$ ${d.toLocaleString('es-AR')}`;

  const billRows = bills
    .filter((b) => b.quantity > 0)
    .map((b) => [
      formatDenom(b.denomination),
      b.quantity.toString(),
      formatNum(b.subtotal),
    ]);

  const totalContado = calcTotalContado(bills);

  if (billRows.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Sin billetes cargados.', margin, y);
    doc.setTextColor(0);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Denominación', 'Cantidad', 'Subtotal']],
      body: billRows,
      foot: [['', 'TOTAL CONTADO', formatNum(totalContado)]],
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [30, 30, 30],
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { halign: 'center' },
        2: { halign: 'right', fontStyle: 'bold' },
      },
      theme: 'grid',
      tableWidth: contentWidth,
    });

    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;
  }

  // ─── Section 4: Diferencia ───────────────────────────────────────────

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. RESULTADO', margin, y);
  y += 6;

  const result = calcComparison(totalEfesperado, totalContado);
  const statusText =
    result.status === 'exact'
      ? 'CUADRA'
      : result.status === 'short'
        ? 'FALTANTE'
        : 'SOBRANTE';

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ['Efectivo esperado', formatNum(result.expectedCash)],
      ['Efectivo contado', formatNum(result.countedCash)],
      [
        `Diferencia (${statusText})`,
        `${result.difference >= 0 ? '+' : ''}${formatNum(result.difference)}`,
      ],
    ],
    bodyStyles: { fontSize: 10, textColor: [30, 30, 30] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    theme: 'grid',
    tableWidth: contentWidth,
  });

  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 12;

  // ─── Footer ───────────────────────────────────────────────────────────

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(160);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;
  doc.text(
    'Rendición de Caja — documento generado automáticamente',
    pageWidth / 2,
    y,
    {
      align: 'center',
    },
  );

  return doc;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PDFGenerator() {
  const days = useRendicionStore((s) => s.days);
  const bills = useRendicionStore((s) => s.bills);

  const hasContent = days.length > 0 || bills.some((b) => b.quantity > 0);

  function getFilename(): string {
    const today = new Date();
    const yy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `rendicion_${yy}${mm}${dd}.pdf`;
  }

  function handleDownload() {
    const doc = buildPDF(days, bills);
    doc.save(getFilename());
  }

  function handleShare() {
    const doc = buildPDF(days, bills);
    const blob = doc.output('blob');
    const file = new File([blob], getFilename(), { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator
        .share({ files: [file], title: 'Rendición de Caja' })
        .catch(() => {
          // User cancelled or share failed — fallback to download
          doc.save(getFilename());
        });
    } else {
      // Fallback: open blob URL in new tab
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h2 className={styles.title}>Exportar PDF</h2>
          <p className={styles.description}>
            Genera un comprobante en A4 blanco y negro listo para imprimir.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.btnDownload}
            onClick={handleDownload}
            disabled={!hasContent}
            title={
              !hasContent ? 'Cargá datos antes de generar el PDF' : undefined
            }
          >
            ↓ Descargar PDF
          </button>
          <button
            className={styles.btnShare}
            onClick={handleShare}
            disabled={!hasContent}
            title={!hasContent ? 'Cargá datos antes de compartir' : undefined}
          >
            ↗ Compartir
          </button>
        </div>
      </div>
      {!hasContent && (
        <p className={styles.hint}>
          Cargá al menos un día o billetes para habilitar la exportación.
        </p>
      )}
    </section>
  );
}
