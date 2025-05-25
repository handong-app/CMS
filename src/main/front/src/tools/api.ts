import { serverRootUrl } from "../constants";
import useAuthStore from "../store/authStore"; // Recoil 대신 Zustand 스토어 임포트
import { useMemo } from "react";

export const fetchBe = (
  jwtValue: string | null,
  path: string,
  method = "GET",
  body?: any
) =>
  new Promise((res, rej) => {
    const initStuff: RequestInit = {
      headers: new Headers(),
      method,
    };
    if (body && !["GET", "HEAD"].includes(method)) {
      if (body instanceof FormData) {
        initStuff["body"] = body;
      } else {
        (initStuff.headers as Headers).set("Content-Type", "application/json");
        initStuff["body"] = JSON.stringify(body);
      }
    }
    if (jwtValue)
      (initStuff.headers as Headers).set("Authorization", `Bearer ${jwtValue}`);

    fetch(serverRootUrl + path, initStuff)
      .then((doc) => {
        if (doc.status === 401) {
          // user not logged in
          localStorage.clear();
          window.location.href = "/land"; // back to home screen.
          return rej({ errorMsg: "로그인을 다시해주세요." });
        }
        doc
          .json()
          .then((json) => {
            // If User not exist (due to db reset, etc)
            if (path === "/user/get" && !json?.email) {
              alert("유저가 존재하지 않습니다. 로그인을 다시해주세요.");
              localStorage.clear();
              window.location.reload();
              return rej({
                errorMsg: "유저가 존재하지 않습니다. 로그인을 다시해주세요.",
              });
            }
            if (doc.status >= 400) return rej(json);
            return res(json);
          })
          .catch(() => {
            if (doc.status === 204) return res(null); // 204 No Content는 null을 반환하도록 수정
            console.error("JSON 파싱 오류", doc);
            return rej({
              errorMsg: "JSON 파싱 오류. Status: " + doc.status,
            });
          });
      })

      .catch((err) => rej(err));
  });

export const useFetchBe = () => {
  const jwtToken = useAuthStore((state) => state.jwtToken); // Zustand 스토어에서 jwtToken 가져오기
  return useMemo(
    () =>
      (path: string, method = "GET", body?: any) =>
        fetchBe(jwtToken, path, method, body),
    [jwtToken]
  );
};
