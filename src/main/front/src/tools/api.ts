import { useMemo } from "react";
import { useNavigate } from "react-router";

import { serverRootUrl } from "../constants";
import useAuthStore from "../store/authStore"; // Recoil 대신 Zustand 스토어 임포트
import { isJwtExpired } from "./tools";

export async function fetchBe(
  jwtValue: string | null,
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" = "GET",
  body?: Record<string, unknown>,
  onUnauthorized?: () => void
): Promise<any> {
  const initStuff: RequestInit = {
    headers: new Headers(),
    method,
  };
  if (body && !["GET", "HEAD"].includes(method)) {
    (initStuff.headers as Headers).set("Content-Type", "application/json");
    initStuff["body"] = JSON.stringify(body);
  }
  if (jwtValue) {
    // 만약에 만료된 jwt 라면
    if (isJwtExpired(jwtValue)) {
      // 서버에서 refresh token 을 사용해 access token 갱신
      const refreshResponse = await fetch(
        serverRootUrl + "/auth/google/refresh",
        {
          method: "POST",
          headers: {
            "Refresh-Token": `Bearer ${useAuthStore.getState().refreshToken}`, // Zustand 스토어에서 refresh token 가져오기
          },
        }
      );
      if (refreshResponse.status === 200) {
        const refreshData = await refreshResponse.json();
        jwtValue = refreshData.accessToken; // 갱신된 access token 사용
        useAuthStore.setState({ jwtToken: jwtValue }); // Zustand 스토어 업데이트
      } else {
        console.error("Access token 갱신 실패", refreshResponse);
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          window.location.href = "/land";
        }
        throw { errorMsg: "Access token 갱신 실패" };
      }
    }

    (initStuff.headers as Headers).set("Authorization", `Bearer ${jwtValue}`);
  }

  try {
    const doc = await fetch(serverRootUrl + path, initStuff);

    if (doc.status === 401) {
      localStorage.clear();
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        window.location.href = "/land";
      }
      throw { errorMsg: "로그인을 다시해주세요." };
    }

    try {
      const text = await doc.text();
      if (!text || doc.status === 204) {
        return null; // 빈 응답이거나 No Content
      }

      const json = JSON.parse(text);

      if (path === "/user/get" && !json?.email) {
        alert("유저가 존재하지 않습니다. 로그인을 다시해주세요.");
        localStorage.clear();
        window.location.reload();
        throw {
          errorMsg: "유저가 존재하지 않습니다. 로그인을 다시해주세요.",
        };
      }
      if (doc.status >= 400) throw json;
      return json;
    } catch {
      console.error("JSON 파싱 오류", doc);
      throw {
        errorMsg: "JSON 파싱 오류. Status: " + doc.status,
      };
    }
  } catch (err) {
    throw err;
  }
}

export const useFetchBe = () => {
  const jwtToken = useAuthStore((state) => state.jwtToken); // Zustand 스토어에서 jwtToken 가져오기
  const navigate = useNavigate();
  return useMemo(
    () =>
      (
        path: string,
        options?: {
          method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
          body?: { [key: string]: any };
          onUnauthorized?: () => void;
        }
      ) =>
        fetchBe(
          jwtToken,
          path,
          options?.method ?? "GET",
          options?.body,
          options?.onUnauthorized ?? (() => navigate("/land"))
        ),
    [jwtToken, navigate]
  );
};
