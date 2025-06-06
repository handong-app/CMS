import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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

// 전화번호 자동 하이픈 함수
const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return phoneNumber.replace(/^(\d{2,3})(\d{1,3})/, "$1-$2");
  }
  if (phoneNumberLength < 10) {
    if (phoneNumber.startsWith("02")) {
      return phoneNumber
        .replace(/^(\d{2})(\d{3,4})(\d{0,4})/, (match, p1, p2, p3) => {
          return `${p1}-${p2}${p3 ? "-" + p3 : ""}`;
        })
        .substring(0, 12);
    }
    return phoneNumber
      .replace(/^(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) => {
        return `${p1}-${p2}${p3 ? "-" + p3 : ""}`;
      })
      .substring(0, 13);
  }
  return phoneNumber
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3")
    .substring(0, 13);
};

const ProfileRegistrationPage: React.FC = () => {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const fetchBe = useFetchBe();
  const navigate = useNavigate();
  const userData = useUserData();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentIdError, setStudentIdError] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const jwtToken = useAuthStore.getState().jwtToken;
  const { data: myData, refetch } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchBe("/v1/user/profile", { onUnauthorized: () => {} }),
  });

  useEffect(() => {
    if (jwtToken) {
      alert("이미 로그인된 사용자입니다.");
      navigate("/profile"); // 또는 "/"로 변경 가능
    }
  }, [jwtToken, navigate]);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (myData) {
      setName((prev) => prev || myData.name || "");
      setStudentId((prev) => prev || myData.studentId || "");
      setPhoneNumber((prev) => prev || myData.phone || "");
      setTermsAgreed(!!myData.studentId);
      setPrivacyAgreed(!!myData.studentId);
    }
  }, [myData]);

  const validateStudentId = (id: string): string => {
    if (!id) return "학번을 입력해주세요.";
    if (!/^\d+$/.test(id)) return "숫자만 입력해주세요.";
    if (id[0] !== "2") return "학번은 '2'로 시작해야 합니다.";
    if (id.length !== 8) return "학번은 8자리여야 합니다.";
    return "";
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
    const currentStudentIdError = validateStudentId(studentId);
    if (currentStudentIdError) {
      setStudentIdError(currentStudentIdError);
      alert(`학번 오류: ${currentStudentIdError}`);
      return;
    }
    if (studentIdError) {
      alert(`학번 형식을 확인해주세요. (${studentIdError})`);
      return;
    }

    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    
    if (!jwtToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const uid = userData?.userId;
    const email = user?.email;

    if (!uid || !email) {
      alert("사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    const payload = {
      userId: uid,
      name,
      studentId,
      email,
      phone: phoneNumber.replace(/-/g, ""),
    };

    console.log("최종 제출 payload:", payload);
    try {
      await fetchBe("/v1/user/profile", {
        method: "PATCH",
        body: payload,
      });

      alert("프로필이 성공적으로 등록되었습니다.");
      navigate("/club/callein");
    } catch (err: any) {
      alert("프로필 등록에 실패했습니다: " + (err.message || "서버 오류"));
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
            onUploaded={() => {void refetch();}}
          />
          <Typography variant="h6" fontWeight="bold">
            프로필 등록
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
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="학번"
            value={studentId}
            onChange={handleStudentIdChange}
            error={!!studentIdError}
            helperText={
              studentIdError ||
              "2로 시작하는 8자리 숫자를 입력하세요. (ex. 2xxxxxxx)"
            }
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

        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                sx={{ color: "white" }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: "white" }}>
                이용약관 동의 (필수)
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                sx={{ color: "white" }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: "white" }}>
                개인정보 수집 및 이용 동의 (필수)
              </Typography>
            }
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1 }}
          disabled={!!studentIdError && studentId.length > 0}
        >
          회원가입
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileRegistrationPage;
