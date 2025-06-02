import React, { useRef , useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { jwtDecode } from "jwt-decode";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface GoogleOAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface DecodedToken {
  name: string;
  email: string;
  picture?: string;
  [key: string]: any;
}



const GoogleOAuthCallback: React.FC = () => {
  const [output, setOutput] = useState("처리 중...");
  const [loginCheckResult, setLoginCheckResult] = useState("");
  const hasFetched = useRef(false); 
  
  const {
    jwtToken,
    refreshToken,
    user,
    setJwtToken,
    setRefreshToken,
    setUser,
    clearAuth,
  } = useAuthStore();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
  const code = searchParams.get("code");
  console.log("📦 받은 code:", code);


  if (!code) {
    console.error("❌ Authorization code가 없습니다.");
    setOutput("Authorization code가 없습니다.");
    return;
  }

  if (hasFetched.current) {
    console.log("⚠️ 이미 요청을 보낸 code입니다. 중복 방지");
    return;
  }

  hasFetched.current = true; // ✅ 한 번만 실행되도록 설정

  const fetchTokens = async (code: string) => {
    try {
      console.log("🚀 백엔드로 code 전송 중...");
      const res = await fetch(
        `${baseUrl}/api/auth/google?code=${encodeURIComponent(code)}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || res.statusText);
      }

      const data: GoogleOAuthResponse = await res.json();

      try {
        const decoded: DecodedToken = jwtDecode(data.accessToken);

        setJwtToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser({
          name: decoded.name,
          email: decoded.email,
          photoURL:
            decoded.picture ||
            "https://lh3.googleusercontent.com/a/default-user",
        });

        console.log("✅ 디코딩된 유저 정보:", decoded);
        setOutput(`로그인 성공! ${decoded.email} 님 환영합니다.`);
        navigate("/register");
      } catch (decodeError) {
        console.error("JWT 디코딩 실패:", decodeError);
        throw new Error("유효하지 않은 토큰입니다.");
      }
    } catch (err: any) {
      console.error("🚨 로그인 처리 중 오류:", err.message || err);
      setOutput("로그인 실패: " + (err.message || "알 수 없는 오류"));
    }
  };
    fetchTokens(code);
  }, [searchParams, navigate, setJwtToken, setRefreshToken, setUser]);

  
  const checkLoginStatus = () => {
    if (!jwtToken) {
      setLoginCheckResult("jwtToken이 없습니다.");
      return;
    }

    fetch(`${baseUrl}/api/auth/google/cb`, {
      method: "GET",
      headers: { Authorization: "Bearer " + jwtToken },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || res.statusText);
        }
        return res.text();
      })
      .then((response) => setLoginCheckResult("서버 응답: " + response))
      .catch((err) => setLoginCheckResult("오류 발생: " + err.message));
  };

  const logout = async () => {
    if (!jwtToken) return alert("jwtToken이 없습니다.");

    try {
      const res = await fetch(`${baseUrl}/api/auth/google/logout`, {
        method: "POST",
        headers: { Authorization: "Bearer " + jwtToken },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || res.statusText);
      }

      clearAuth();
      setOutput("로그아웃 성공!");
    } catch (err: any) {
      setOutput("로그아웃 실패: " + err.message);
    }
  };

  const refreshAccessToken = () => {
    if (!refreshToken) return alert("refreshToken이 없습니다.");

    fetch(`${baseUrl}/api/auth/google/refresh`, {
      method: "POST",
      headers: { "Refresh-Token": "Bearer " + refreshToken },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || res.statusText);
        }
        return res.json() as Promise<{ accessToken: string }>;
      })
      .then((data) => {
        setJwtToken(data.accessToken);
        setOutput("새 JWT 토큰 발급 완료!");
      })
      .catch((err) => setOutput("재발급 실패: " + err.message));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Google OAuth 인증 처리 중...</h2>
      <pre>{output}</pre>
      <button style={{ marginTop: 10 }} onClick={checkLoginStatus}>
        로그인 상태 확인
      </button>
      <pre>{loginCheckResult}</pre>
      <button style={{ marginTop: 10 }} onClick={logout}>
        로그아웃
      </button>
      <button style={{ marginTop: 10 }} onClick={refreshAccessToken}>
        JWT 토큰 재발급
      </button>
      <div style={{ marginTop: 20 }}>
        <h4>🔐 토큰 및 사용자 정보</h4>
        <pre>JWT Token: {jwtToken || "없음"}</pre>
        <pre>Refresh Token: {refreshToken || "없음"}</pre>
        <pre>User Email: {user?.email || "없음"}</pre>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
