import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  BILL_DENOMINATIONS,
  BillCount,
  BillDenomination,
  DayEntry,
} from '../types';
import {
  createDayEntry,
  createInitialBills,
  updateBillCount,
} from '../utils/calculations';
import { storageService } from '../services/storageService';

const MAX_DAYS = 6;

// ─── State shape ─────────────────────────────────────────────────────────────

interface RendicionStore {
  days: DayEntry[];
  bills: BillCount[];

  // Actions
  addDay: (
    date: string,
    totalFacturado: number,
    posnet: number,
    gastos?: number,
    descripcionGasto?: string,
  ) => string | null;
  removeDay: (id: string) => void;
  updateBillQuantity: (
    denomination: BillDenomination,
    quantity: number,
  ) => void;
  clearRendicion: () => void;
  hydrate: () => void;
}

// ─── Initial state ───────────────────────────────────────────────────────────

const initialBills = createInitialBills(BILL_DENOMINATIONS);

const defaultState = {
  days: [] as DayEntry[],
  bills: initialBills,
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useRendicionStore = create<RendicionStore>()(
  subscribeWithSelector((set, get) => ({
    ...defaultState,

    addDay(date, totalFacturado, posnet, gastos, descripcionGasto) {
      const state = get();

      if (state.days.length >= MAX_DAYS) {
        return `Máximo ${MAX_DAYS} días permitidos.`;
      }

      const duplicate = state.days.find((d) => d.date === date);
      if (duplicate) {
        return 'Ya existe una rendición para esa fecha.';
      }

      const entry = createDayEntry(date, totalFacturado, posnet, gastos, descripcionGasto);
      const days = [...state.days, entry].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      set({ days });
      storageService.save({ days, bills: state.bills });
      return null;
    },

    removeDay(id) {
      const state = get();
      const days = state.days.filter((d) => d.id !== id);
      set({ days });
      storageService.save({ days, bills: state.bills });
    },

    updateBillQuantity(denomination, quantity) {
      const state = get();
      const bills = updateBillCount(state.bills, denomination, quantity);
      set({ bills });
      storageService.save({ days: state.days, bills });
    },

    clearRendicion() {
      const bills = createInitialBills(BILL_DENOMINATIONS);
      set({ days: [], bills });
      storageService.clear();
    },

    hydrate() {
      const saved = storageService.load();
      if (!saved) return;

      // Ensure bills array covers all denominations (forward-compatibility)
      const mergedBills = BILL_DENOMINATIONS.map((denom) => {
        const found = saved.bills?.find((b) => b.denomination === denom);
        return found ?? { denomination: denom, quantity: 0, subtotal: 0 };
      });

      set({
        days: saved.days ?? [],
        bills: mergedBills,
      });
    },
  })),
);
