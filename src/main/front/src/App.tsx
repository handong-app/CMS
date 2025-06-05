// src/App.tsx

import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Box } from "@mui/material";
import MyAppBar from "./components/common/MyAppBar";
import useAuthStore from "./store/authStore";
import { serverRootUrl } from "./constants";

const App = () => {
  const user = useAuthStore((state) => state.user);
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setJwtToken = useAuthStore((state) => state.setJwtToken);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  // 💡 mount 시 자동 로그인 복구
  useEffect(() => {
    if (!jwtToken && refreshToken) {
      (async () => {
        try {
          const res = await fetch(serverRootUrl + "/auth/google/refresh", {
            method: "POST",
            headers: {
              "Refresh-Token": `Bearer ${refreshToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setJwtToken(data.accessToken);
            setUser({
              name: data.name,
              email: data.email,
              photoURL: data.photoURL,
            });
            console.log("✅ Access token refreshed successfully.");
          } else {
            console.warn("❌ Refresh token invalid.");
            useAuthStore.getState().clearAuth();
            navigate("/");
          }
        } catch (err) {
          console.error("🚨 Token refresh failed:", err);
          useAuthStore.getState().clearAuth();
          navigate("/");
        }
      })();
    }
  }, [jwtToken, refreshToken, setJwtToken, setUser, navigate]);

  return (
    <>
      <MyAppBar user={user} />
      <Box component="main" mt={2}>
        <Outlet />
      </Box>
    </>
  );
};

export default App;
