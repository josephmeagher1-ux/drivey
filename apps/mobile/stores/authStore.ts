import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

interface AuthState {
  signedIn: boolean;
  email?: string;
  signIn: (email: string) => void;
  signOut: () => void;
}

/**
 * On web we persist to localStorage so a hard refresh or URL paste doesn't
 * bounce the user back to the sign-in screen. On native the store is
 * in-memory only (production would wire AsyncStorage here).
 */
const storage =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? createJSONStorage(() => window.localStorage)
    : undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      signedIn: false,
      email: undefined,
      signIn: (email) => set({ signedIn: true, email }),
      signOut: () => set({ signedIn: false, email: undefined }),
    }),
    {
      name: 'drivey-auth',
      storage,
      // Native falls through with no storage → persist becomes a no-op
      skipHydration: Platform.OS !== 'web',
    },
  ),
);
