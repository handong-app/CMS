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

// 전화번호 자동 하이픈 함수
const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return phoneNumber.replace(/^(\d{2,3})(\d{1,3})/, '$1-$2');
  }
  if (phoneNumberLength < 10) {
    if (phoneNumber.startsWith("02")) {
        return phoneNumber.replace(/^(\d{2})(\d{3,4})(\d{0,4})/, (match, p1, p2, p3) => {
            return `${p1}-${p2}${p3 ? '-' + p3 : ''}`;
        }).substring(0, 12);
    }
    return phoneNumber.replace(/^(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) => {
        return `${p1}-${p2}${p3 ? '-' + p3 : ''}`;
    }).substring(0, 13);
  }
  return phoneNumber.replace(/^(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3').substring(0, 13);
};

const ProfileRegistrationPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const fetchBe = useFetchBe();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState(""); // studentYear -> studentId로 변경
  const [studentIdError, setStudentIdError] = useState<string>(""); // 학번 유효성 검사 오류 메시지 상태
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const validateStudentId = (id: string): string => {
    if (!id) {
      return "학번을 입력해주세요."; // 필수 입력으로 가정
    }
    if (!/^\d+$/.test(id) && id.length > 0) { // 숫자만 있는지 확인 (이미 onChange에서 처리하지만, 이중 체크)
        return "숫자만 입력해주세요.";
    }
    if (id[0] !== '2') {
      return "학번은 '2'로 시작해야 합니다.";
    }
    if (id.length !== 8) {
      return "학번은 8자리여야 합니다.";
    }
    return ""; // 유효한 경우 빈 문자열 반환
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // 숫자 이외의 문자 제거
    const slicedValue = value.slice(0, 8); // 최대 8자리로 제한

    setStudentId(slicedValue);

    if (slicedValue.length > 0) { // 입력이 있을 때만 유효성 검사 메시지 업데이트
        if (slicedValue[0] !== '2') {
            setStudentIdError("학번은 '2'로 시작해야 합니다.");
        } else if (slicedValue.length < 8) {
            setStudentIdError("학번은 8자리여야 합니다.");
        } else {
            setStudentIdError(""); // 모든 조건 만족
        }
    } else {
        setStudentIdError(""); // 비어있을 때는 에러 메시지 없음 (또는 "학번을 입력해주세요"로 설정 가능)
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  const handleSubmit = async () => {
    // 학번 최종 유효성 검사
    const currentStudentIdError = validateStudentId(studentId);
    if (currentStudentIdError) {
      setStudentIdError(currentStudentIdError); // 에러 상태 업데이트하여 UI에 표시
      alert(`학번 오류: ${currentStudentIdError}`);
      return;
    }
    // 에러 상태가 이미 있다면 그것도 체크 (실시간 피드백과 중복될 수 있으나 안전장치)
    if (studentIdError) {
        alert(`학번 형식을 확인해주세요. (${studentIdError})`);
        return;
    }


    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    const jwtToken = useAuthStore.getState().jwtToken;
    let uid: string | null = null;
    let email: string | null = null;

    if (jwtToken) {
      try {
        const decodedPayload = JSON.parse(atob(jwtToken.split(".")[1]));
        uid = decodedPayload.sub;
        email = decodedPayload.email;
        // console.log("JWT Payload:", decodedPayload); // JWT 로깅은 필요시 활성화
      } catch (e) {
        console.error("JWT 디코딩 실패:", e);
        alert("사용자 정보를 가져오는데 실패했습니다. 다시 로그인해주세요.");
        return;
      }
    } else {
      console.warn("jwtToken 없음");
      alert("로그인이 필요합니다.");
      return;
    }

    if (!uid || !email) {
      alert("사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    const rawPhoneNumber = phoneNumber.replace(/-/g, "");

    const payload = {
      userId: uid,
      name: name,
      studentId: studentId, // studentYear -> studentId
      email: email,
      phone: rawPhoneNumber,
      profileImage: null,
    };
    console.log("최종 제출 payload:", payload);
    try {
      await fetchBe("/v1/user/profile", {
        method: "PATCH",
        body: payload,
      });

      alert("프로필이 성공적으로 등록되었습니다.");
      // TODO: 성공 후 페이지 이동 또는 상태 변경 로직 (예: router.push('/profile'))
    } catch (err: any) {
      alert("프로필 등록에 실패했습니다: " + (err.message || "서버 오류"));
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

        <Box mb={2}>
          <TextField
            fullWidth
            label="학번"
            value={studentId}
            onChange={handleStudentIdChange} // 변경된 핸들러 사용
            error={!!studentIdError} // studentIdError가 있으면 true
            helperText={studentIdError || "2로 시작하는 8자리 숫자를 입력하세요. (ex. 2xxxxxxx)"} // 에러 메시지 또는 안내 문구
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "white" },
              // maxLength: 8, // onChange 핸들러에서 slice로 처리하므로 중복이지만, 명시적으로 둘 수도 있음
            }}
            variant="outlined"
            type="text" // type="number"는 스피너를 표시할 수 있어 text로 두고 숫자만 필터링
            inputMode="numeric" // 모바일에서 숫자 키패드 유도
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="전화번호"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "white" },
              // maxLength: 13, // formatPhoneNumber 함수에서 길이 조절
            }}
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
          disabled={!!studentIdError && studentId.length > 0} // 학번 에러가 있고, 입력값이 존재하면 제출 버튼 비활성화
        >
          회원가입
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileRegistrationPage;