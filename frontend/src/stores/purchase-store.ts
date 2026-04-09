import { create } from 'zustand';
import { manas, type PurchaseInfo } from '../lib/api';

interface PurchaseState {
  purchases: PurchaseInfo[];
  isLoading: boolean;

  loadPurchases: (userId: string) => Promise<void>;
  hasPurchased: (product: string) => boolean;
  checkAccess: (userId: string, product?: string) => Promise<boolean>;
}

export const usePurchaseStore = create<PurchaseState>((set, get) => ({
  purchases: [],
  isLoading: false,

  loadPurchases: async (userId: string) => {
    set({ isLoading: true });
    try {
      const data = await manas.getPurchases(userId);
      set({ purchases: data.purchases });
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },

  hasPurchased: (product: string) => {
    return get().purchases.some(
      (p) => p.product === product && p.status === 'completed'
    );
  },

  checkAccess: async (userId: string, product = 'deep_assessment') => {
    try {
      const data = await manas.hasAccess(userId, product);
      return data.has_access;
    } catch {
      return false;
    }
  },
}));
