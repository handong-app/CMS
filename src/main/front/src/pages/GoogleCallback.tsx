import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { jwtDecode } from "jwt-decode";

const baseUrl = "http://localhost:8080";

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
  const [jwtToken, setJwtTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const setJwtToken = useAuthStore((state) => state.setJwtToken);
  const setUser = useAuthStore((state) => state.setUser);
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

    const fetchTokens = async (code: string) => {
      try {
        console.log("🚀 백엔드로 code 전송 중...");
        const res = await fetch(`${baseUrl}/api/auth/google?code=${encodeURIComponent(code)}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          console.error("❌ 서버 응답 실패:", errorData);
          throw new Error(errorData?.error || res.statusText);
        }

        const data: GoogleOAuthResponse = await res.json();

        // 토큰 저장
        localStorage.setItem("jwtToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        setJwtToken(data.accessToken);
        setJwtTokenState(data.accessToken);
        setRefreshToken(data.refreshToken);

        // JWT 디코딩으로 유저 정보 추출
        const decoded: DecodedToken = jwtDecode(data.accessToken);
        setUserEmail(decoded.email);
        setUser({
          name: decoded.name,
          email: decoded.email,
          photoURL: decoded.picture || "https://lh3.googleusercontent.com/a/default-user",
        });

        console.log("✅ 디코딩된 유저 정보:", decoded);
        setOutput(`로그인 성공! ${decoded.email} 님 환영합니다.`);

        navigate("/register");
      } catch (err: any) {
        console.error("🚨 로그인 처리 중 오류:", err.message || err);
        setOutput("로그인 실패: " + (err.message || "알 수 없는 오류"));
      }
    };

    fetchTokens(code);
  }, [searchParams, navigate, setJwtToken, setUser]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("jwtToken");
    console.log("📤 로그인 상태 확인용 jwtToken:", token);

    if (!token) {
      setLoginCheckResult("jwtToken이 없습니다.");
      return;
    }

    fetch(`${baseUrl}/api/auth/google/cb`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
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

  const logout = () => {
    const token = localStorage.getItem("jwtToken");
    console.log("🔓 로그아웃 요청용 jwtToken:", token);

    if (!token) return alert("jwtToken이 없습니다.");

    fetch(`${baseUrl}/api/auth/google/logout`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || res.statusText);
        }
        return res.text();
      })
      .then(() => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("refreshToken");
        setJwtToken(null);
        setJwtTokenState(null);
        setRefreshToken(null);
        setUserEmail(null);
        setUser(null);
        setOutput("로그아웃 성공!");
      })
      .catch((err) => setOutput("로그아웃 실패: " + err.message));
  };

  const refreshAccessToken = () => {
    const refresh = localStorage.getItem("refreshToken");
    console.log("🔄 리프레시 토큰:", refresh);

    if (!refresh) return alert("refreshToken이 없습니다.");

    fetch(`${baseUrl}/api/auth/google/refresh`, {
      method: "POST",
      headers: { "Refresh-Token": "Bearer " + refresh },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || res.statusText);
        }
        return res.json() as Promise<{ accessToken: string }>;
      })
      .then((data) => {
        localStorage.setItem("jwtToken", data.accessToken);
        setJwtToken(data.accessToken);
        setJwtTokenState(data.accessToken);
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
        <pre>User Email: {userEmail || "없음"}</pre>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
