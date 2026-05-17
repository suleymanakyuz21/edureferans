import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  isPremium: boolean;
  role?: string;
  refCode?: string;
  balance?: number;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  setAuth: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      setAuth: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: async () => {
        // Clear server-side HttpOnly cookie
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        set({ user: null });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-user',
      // Only persist user display data — auth is handled by HttpOnly cookie
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
