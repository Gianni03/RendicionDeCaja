import { v4 as uuidv4 } from 'uuid';
import {
  BillCount,
  BillDenomination,
  ComparisonResult,
  ComparisonStatus,
  DayEntry,
} from '../types';

// ─── Day Entry ──────────────────────────────────────────────────────────────

export function calcEfectivoDia(
  totalFacturado: number,
  posnet: number,
  gastos: number = 0,
): number {
  return (totalFacturado - posnet) - gastos;
}

export function createDayEntry(
  date: string,
  totalFacturado: number,
  posnet: number,
  gastos: number = 0,
  descripcionGasto?: string,
): DayEntry {
  const efectivoDia = calcEfectivoDia(totalFacturado, posnet, gastos);
  
  const entry: DayEntry = {
    id: uuidv4(),
    date,
    totalFacturado,
    posnet,
    efectivoDia,
    gastos,
  };

  if (descripcionGasto && descripcionGasto.length > 0) {
    entry.descripcionGasto = descripcionGasto.slice(0, 50);
  }

  return entry;
}

// ─── Totals ─────────────────────────────────────────────────────────────────

export function calcTotalPosnet(days: DayEntry[]): number {
  return days.reduce((acc, d) => acc + d.posnet, 0);
}

export function calcTotalEfectivoEsperado(days: DayEntry[]): number {
  return days.reduce((acc, d) => acc + d.efectivoDia, 0);
}

export function calcTotalGastos(days: DayEntry[]): number {
  return days.reduce((acc, d) => acc + (d.gastos || 0), 0);
}

// ─── Bills ──────────────────────────────────────────────────────────────────

export function calcBillSubtotal(
  denomination: BillDenomination,
  quantity: number,
): number {
  return denomination * quantity;
}

export function createInitialBills(
  denominations: BillDenomination[],
): BillCount[] {
  return denominations.map((denomination) => ({
    denomination,
    quantity: 0,
    subtotal: 0,
  }));
}

export function updateBillCount(
  bills: BillCount[],
  denomination: BillDenomination,
  quantity: number,
): BillCount[] {
  return bills.map((b) =>
    b.denomination === denomination
      ? {
          ...b,
          quantity,
          subtotal: calcBillSubtotal(denomination, quantity),
        }
      : b,
  );
}

export function calcTotalContado(bills: BillCount[]): number {
  return bills.reduce((acc, b) => acc + b.subtotal, 0);
}

// ─── Comparison ─────────────────────────────────────────────────────────────

export function calcComparison(
  expectedCash: number,
  countedCash: number,
): ComparisonResult {
  const difference = countedCash - expectedCash;
  let status: ComparisonStatus;

  if (difference === 0) {
    status = 'exact';
  } else if (difference < 0) {
    status = 'short';
  } else {
    status = 'surplus';
  }

  return { expectedCash, countedCash, difference, status };
}

// ─── Formatting ─────────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoDate: string): string {
  // Parse "YYYY-MM-DD" avoiding timezone shift
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
