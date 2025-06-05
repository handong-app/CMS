// src/pages/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import useAuthStore from "../store/authStore";
import { useFetchBe } from "../tools/api";
import { useTheme } from "@mui/material/styles";
import UserProfileImageUploadBox from "../components/UserProfileImageUploadBox";
import useUserData from "../hooks/userData";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const len = phoneNumber.length;

  if (len < 4) return phoneNumber;
  if (len < 7) return phoneNumber.replace(/^(\d{2,3})(\d{1,3})/, "$1-$2");
  if (len < 10) {
    if (phoneNumber.startsWith("02")) {
      return phoneNumber
        .replace(/^(\d{2})(\d{3,4})(\d{0,4})/, (_, p1, p2, p3) =>
          `${p1}-${p2}${p3 ? "-" + p3 : ""}`
        )
        .substring(0, 12);
    }
    return phoneNumber
      .replace(/^(\d{3})(\d{3})(\d{0,4})/, (_, p1, p2, p3) =>
        `${p1}-${p2}${p3 ? "-" + p3 : ""}`
      )
      .substring(0, 13);
  }
  return phoneNumber
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3")
    .substring(0, 13);
};

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const jwtToken = useAuthStore.getState().jwtToken;
  const fetchBe = useFetchBe();
  const navigate = useNavigate();
  const userData = useUserData();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string>("");

  const [studentId, setStudentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [studentIdError, setStudentIdError] = useState<string>("");

  useEffect(() => {
    if (!jwtToken) {
      alert("로그인이 필요합니다.");
      navigate("/land");
    }
  }, [jwtToken, navigate]);

  const { data: myData, refetch } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchBe("/v1/user/profile", { onUnauthorized: () => {} }),
    enabled: !!jwtToken,
  });

  useEffect(() => {
    if (myData) {
      setName(myData.name || "");
      setStudentId(myData.studentId || "");
      setPhoneNumber(formatPhoneNumber(myData.phone || ""));
    }
  }, [myData]);

  const validateStudentId = (id: string): string => {
    if (!id) return "";
    if (!/^\d+$/.test(id)) return "숫자만 입력해주세요.";
    if (id[0] !== "2") return "학번은 '2'로 시작해야 합니다.";
    if (id.length !== 8) return "학번은 8자리여야 합니다.";
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setName(value);
    setNameError(value.length === 0 ? "이름을 입력해주세요." : "");
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 8);
    setStudentId(value);
    setStudentIdError(value.length > 0 ? validateStudentId(value) : "");
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = async () => {
    const uid = userData?.userId;
    const email = user?.email;

    if (!uid || !email) {
      alert("사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      navigate("/land");
      return;
    }

    if (name.trim().length === 0) {
      setNameError("이름을 입력해주세요.");
      return;
    }

    const payload = {
      userId: uid,
      name,
      studentId,
      email,
      phone: phoneNumber.replace(/-/g, ""),
    };

    try {
      await fetchBe("/v1/user/profile", {
        method: "PATCH",
        body: payload,
      });
      alert("프로필이 수정되었습니다.");
      navigate("/");
    } catch (err: any) {
      alert("프로필 수정에 실패했습니다: " + (err.message || "서버 오류"));
      console.error(err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      height="calc(110vh - 64px)"
      sx={{
        background: theme.palette.background.default || "#1A1A1A",
        px: 2,
        paddingTop: theme.spacing(10),
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          color: "white",
        }}
      >
        <Box textAlign="center" mb={3}>
          <UserProfileImageUploadBox
            key={myData?.profileImage}
            userId={userData?.userId || ""}
            photoURL={myData?.profileImage}
            size={80}
            onUploaded={() => {
              void refetch();
            }}

          />
          <Typography variant="h6" fontWeight="bold">
            프로필 수정
          </Typography>
          {user?.name && (
            <Typography variant="body2" sx={{ mt: 0.5, color: "#bbb" }}>
              {user.name}
            </Typography>
          )}
        </Box>


        <Box mb={2}>
          <TextField
            fullWidth
            label="이름"
            value={name}
            onChange={handleNameChange}
            error={!!nameError}
            helperText={nameError}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="학번"
            value={studentId}
            onChange={handleStudentIdChange}
            error={!!studentIdError}
            helperText={studentIdError || "2로 시작하는 8자리 숫자를 입력하세요."}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
            type="text"
            inputMode="numeric"
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="전화번호"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
            type="tel"
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1 }}
        >
          프로필 저장
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
