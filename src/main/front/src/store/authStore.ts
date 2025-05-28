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
  setJwtToken: (token: string | null) => void;
  setUser: (user: UserInfo | null) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwtToken: null,
      user: null,
      setJwtToken: (token) => set({ jwtToken: token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth", // localStorage key
      partialize: (state) => ({
        jwtToken: state.jwtToken,
        user: state.user ? { name: state.user.name } : null, // ❗ 최소 정보만
      }),
    }
  )
);

export default useAuthStore;
