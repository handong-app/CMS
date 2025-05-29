// src/utils/auth.ts
import useAuthStore from "../store/authStore";

// Google OAuth 로그인 창 오픈
export const initiateGoogleLogin = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/auth/google/client-id`
    );
    if (!res.ok) throw new Error(`Client ID 조회 실패: ${res.status}`);
    const clientId = await res.text();

    const redirectUri = encodeURIComponent(window.location.origin + "/google/callback");
    const scope = encodeURIComponent("openid email profile");
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = authUrl;
  } catch (err) {
    console.error("[GoogleLogin] 초기화 오류:", err);
    alert("구글 로그인 초기화에 실패했습니다.");
  }
};

//로그인 정보 초기화 (Zustand 스토어 + localStorage)
export const clearAuth = () => {
  const store = useAuthStore.getState();

  // Zustand 상태 초기화
  store.setJwtToken(null);
  store.setUser(null);

  // 만약 localStorage에 직접 저장된 값이 있다면 아래도 포함 가능:
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshToken");
};
