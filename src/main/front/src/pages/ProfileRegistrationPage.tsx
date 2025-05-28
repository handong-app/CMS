import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Avatar,
  Typography,
} from "@mui/material";

import useAuthStore from "../store/authStore";

const ProfileRegistrationPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSubmit = () => {
    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    console.log({
      name,
      inviteCode,
      studentYear,
      phoneNumber,
    });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="calc(100vh - 64px)"
      bgcolor="#f5f5f5"
    >
      <Box
        p={4}
        bgcolor="white"
        borderRadius={4}
        boxShadow={3}
        width={360}
        textAlign="center"
      >
        <Avatar
          alt={user?.name || "사용자"}
          src={user?.photoURL || "https://lh3.googleusercontent.com/a/default-user"}
          sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
        />

        <Box mb={2}>
          <TextField
            fullWidth
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="초대코드"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="학번"
            value={studentYear}
            onChange={(e) => setStudentYear(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="전화번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          mb={2}
          ml={0.5}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" color="textPrimary">
                이용약관 (필수)
              </Typography>
            }
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" color="textPrimary">
                개인정보 수집 및 이용 (필수)
              </Typography>
            }
          />
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            회원가입
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileRegistrationPage;
