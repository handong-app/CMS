import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  name: string;
  email: string;
  photoURL: string;
}

interface AuthState {
  jwtToken: string | null;
  user: UserInfo | null;
  refreshToken: string | null;
  setJwtToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwtToken: null,
      refreshToken: null,
      user: null,
      setJwtToken: (token) => set({ jwtToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ jwtToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "auth", // localStorage key
      partialize: (state) => ({
        jwtToken: state.jwtToken,
        refreshToken: state.refreshToken,
        user: state.user
          ? {
              name: state.user.name,
              email: state.user.email,
              photoURL: state.user.photoURL,
            }
          : null,
      }),
    }
  )
);

export default useAuthStore;
