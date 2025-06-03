import { jwtDecode } from "jwt-decode";
import useAuthStore from "../store/authStore";
import { useMemo } from "react";

type DecodedToken = {
  studentId: string;
  name: string;
  isAdmin: boolean;
  email: string;
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  nbf: number;
  exp: number;
};

const useUserData = () => {
  const jwt = useAuthStore((state) => state.jwtToken);
  return useMemo(() => {
    if (!jwt) return { userId: null, name: null, isAdmin: false, email: null };
    const decoded = jwtDecode<DecodedToken>(jwt);
    // sub: "user-uid" 형태에서 uid만 추출
    let userId = decoded.sub;
    if (userId && userId.startsWith("user-")) {
      userId = userId.slice(5);
    }
    return { ...decoded, userId };
  }, [jwt]);
};

export default useUserData;
