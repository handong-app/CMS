import { create } from "zustand";

interface AuthState {
  jwtToken: string | null;
  setJwtToken: (token: string | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  jwtToken: localStorage.getItem("jwtToken"),
  setJwtToken: (token) =>
    set(() => {
      if (token) {
        localStorage.setItem("jwtToken", token);
      } else {
        localStorage.removeItem("jwtToken");
      }
      return { jwtToken: token };
    }),
}));

export default useAuthStore;
