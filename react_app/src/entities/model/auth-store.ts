
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthData {
    requester: string;
    location: string;
    time: string;
}

interface AuthState {
    data: AuthData | null;
    setAuthData: (data: AuthData | null) => void; 
    clearAuthData: () => void;
  }
  
  export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        data: null,
        setAuthData: (data) => set({ data }),  
        clearAuthData: () => set({ data: null }),
      }),
      {
        name: 'auth-storage',
      }
    )
  );