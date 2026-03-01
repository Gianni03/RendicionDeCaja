// ─── Types ─────────────────────────────────────────────────────────────────

export type BillDenomination = 100 | 200 | 500 | 1000 | 2000 | 10000 | 20000;

export const BILL_DENOMINATIONS: BillDenomination[] = [
  100, 200, 500, 1000, 2000, 10000, 20000,
];

export interface DayEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  totalFacturado: number;
  posnet: number;
  efectivoDia: number; // computed: totalFacturado - posnet
}

export interface BillCount {
  denomination: BillDenomination;
  quantity: number;
  subtotal: number; // computed: denomination * quantity
}

export type ComparisonStatus = 'exact' | 'short' | 'surplus';

export interface ComparisonResult {
  expectedCash: number;
  countedCash: number;
  difference: number; // countedCash - expectedCash
  status: ComparisonStatus;
}

export interface RendicionState {
  days: DayEntry[];
  bills: BillCount[];
}

// ─── Form Input ─────────────────────────────────────────────────────────────

export interface DayFormInput {
  date: string;
  totalFacturado: string;
  posnet: string;
}
