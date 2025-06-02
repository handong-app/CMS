import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Avatar,
  Typography,
  Paper,
} from "@mui/material";
import useAuthStore from "../store/authStore";
import { useFetchBe } from "../tools/api"; 

const ProfileRegistrationPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const fetchBe = useFetchBe();

  const [name, setName] = useState("");
  // const [inviteCode, setInviteCode] = useState(""); // TODO: 초대코드 전달 구현
  const [studentYear, setStudentYear] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSubmit = async () => {
    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    const jwtToken = useAuthStore.getState().jwtToken;

    if (jwtToken) {
      try {
        const payload = JSON.parse(atob(jwtToken.split(".")[1]));
        console.log("✅ JWT Payload:", payload);
      } catch (e) {
        console.error("❌ JWT 디코딩 실패:", e);
      }
    } else {
      console.warn("❗ jwtToken 없음");
    }

    let uid: string | null = null;
    let email: string | null = null;

    if (jwtToken) {
      try {
        const payload = JSON.parse(atob(jwtToken.split(".")[1]));
        uid = payload.sub;
        email = payload.email;
      } catch (e) {
        console.error("JWT 디코딩 실패", e);
      }
    }

    if (!uid || !email) {
      alert("로그인이 필요합니다.");
      return;
    }

    const payload = {
      userId: uid,                        // ✅ sub에서 가져온 userId
      name: name,
      studentId: studentYear,
      email: email,                      // ✅ jwt에서 추출한 이메일
      phone: phoneNumber,
      profileImage: null,               // ✅ 아직 미사용
    };
    console.log("🚀 최종 제출 payload:", payload); // ← 여기에 추가
    try {
      await fetchBe("/v1/user/profile", {
        method: "PATCH",
        body: payload,
      });
      

      alert("프로필이 성공적으로 등록되었습니다.");
    } catch (err: any) {
      alert("프로필 등록에 실패했습니다.");
      console.error(err);
    }
  };


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 64px)"
      sx={{
        background: "linear-gradient(to bottom, #0f0f1a, #1c1c2e)",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 4,
          backgroundColor: "#1e1e2f",
          color: "white",
        }}
      >
        <Box textAlign="center" mb={3}>
          <Avatar
            alt={user?.name || "사용자"}
            src={user?.photoURL || "https://lh3.googleusercontent.com/a/default-user"}
            sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
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

        {/* <Box mb={2}>
          <TextField
            fullWidth
            label="초대코드"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
          />
        </Box> */}

        <Box mb={2}>
          <TextField
            fullWidth
            label="학번"
            value={studentYear}
            onChange={(e) => setStudentYear(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="전화번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "white" } }}
            variant="outlined"
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
        >
          회원가입
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileRegistrationPage;