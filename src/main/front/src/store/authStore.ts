import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchBe } from "../tools/api";
import { UserProfile } from "../types/clubmember.types";

interface AuthState {
  jwtToken: string | null;
  user: UserProfile | null;
  refreshToken: string | null;
  setJwtToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  clearAuth: () => void;
  fetchUserInfo: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      jwtToken: null,
      refreshToken: null,
      user: null,
      setJwtToken: (token) => set({ jwtToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ jwtToken: null, refreshToken: null, user: null }),
      fetchUserInfo: async () => {
        if (process.env.NODE_ENV === "test") return; // 테스트 환경에서는 호출 안 함

        if (get().user) return; // 이미 유저 정보가 있다면 불필요한 요청 방지
        const userInfo = await fetchBe(
          get().jwtToken,
          "/v1/user/profile",
          "GET",
          undefined,
          () => {}
        );
        if (userInfo) {
          set({
            user: {
              userId: userInfo.userId,
              name: userInfo.name,
              studentId: userInfo.studentId,
              phone: userInfo.phone,
              email: userInfo.email,
              profileImage: userInfo.profileImage || "",
            },
          });
        } else {
          console.error("Failed to fetch user info");
        }
      },
    }),
    {
      name: "auth", // localStorage key
      partialize: (state) => ({
        jwtToken: state.jwtToken,
        refreshToken: state.refreshToken,
        // user: state.user
        //   ? {
        //       name: state.user.name,
        //       email: state.user.email,
        //     }
        //   : null,
      }),
    }
  )
);

export default useAuthStore;
