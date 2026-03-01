import { RendicionState } from '../types';

const STORAGE_KEY = 'rendicion_v1';

export const storageService = {
  save(state: RendicionState): void {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('[storageService] Error saving state:', error);
    }
  },

  load(): RendicionState | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized) as RendicionState;
    } catch (error) {
      console.error('[storageService] Error loading state:', error);
      return null;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[storageService] Error clearing state:', error);
    }
  },
};
