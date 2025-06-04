// src/pages/LandingPage.tsx (가정)
// 또는 LandingPage가 있는 실제 경로
import React from "react";
import { Box, Typography, Button, AppBar, Toolbar, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // useTheme 훅 임포트
import { initiateGoogleLogin } from "../utils/auth";
import LottieBackground from '../components/LandingPage/LottieBackground'; // Lottie 배경 컴포넌트 임포트

const LandingPage: React.FC = () => {
  const theme = useTheme(); // 테마 객체 가져오기

  // AppBar의 높이를 계산합니다.
  // Material-UI의 툴바 기본 높이(64px for desktop, 56px for mobile)와 AppBar의 py:2 (16px)를 고려
  // theme.mixins.toolbar를 사용하여 정확한 높이를 가져오는 것이 가장 좋습니다.
  // const appBarHeight = theme.mixins.toolbar.minHeight; // 반응형 높이를 가져올 때
  // 현재 코드의 AppBar py:2 고려 (2 * theme.spacing(1) = 16px)
  const appBarHeight = `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`;
  // 또는 단순히 '80px' 와 같이 고정 값으로 시작해도 됩니다 (일반적인 AppBar 높이).
  // const appBarHeight = '80px';


  return (
    // 최상위 Box에 position: 'relative'를 주어 자식의 position: 'absolute'가 작동하도록 합니다.
    <Box
      sx={{
        backgroundColor: theme.palette.background.default || "#1A1A1A",
        minHeight: "100vh",
        color: theme.palette.text.primary || "#FFFFFF",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* MyAppBar를 여기에 렌더링하거나, App.tsx 등 상위 컴포넌트에서 렌더링하는지 확인 필요 */}
      {/* 만약 MyAppBar가 App.tsx 같은 곳에서 이미 렌더링되고 있다면, 여기서는 제거해야 합니다. */}
      {/* <MyAppBar user={null} /> */} {/* 여기에 user 정보를 전달해야 한다면 prop을 통해 */}

      {/* Lottie 배경 애니메이션: top을 앱 바 높이만큼 내리고, height도 그만큼 줄입니다. */}
      <LottieBackground appBarHeight={appBarHeight} />

      {/* 메인 콘텐츠 블록: paddingTop을 앱 바 높이만큼 추가하여 앱 바에 가려지지 않도록 합니다. */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          paddingTop: appBarHeight, // ⭐⭐ 이 부분이 가장 중요합니다. 앱 바 높이만큼 패딩 추가
          minHeight: `calc(100vh - ${appBarHeight})`, // 전체 높이에서 앱 바 높이를 뺀 나머지
          textAlign: { xs: "center", md: "left" },
          maxWidth: "1600px",
          mx: "auto",
          px: 1, // 기존 px 값을 유지하여 전체 콘텐츠의 좌우 여백을 줍니다.
          gap: 4, // 요소들 사이의 간격
          pt: { xs: 4, md: 0 }, // 기존 pt는 그대로 두되, paddingTop이 우선 적용될 수 있음
          position: 'relative',
          zIndex: 1, // Lottie 배경 위에 오도록
        }}
      >
        {/* 왼쪽 텍스트 블록: Unlock Your Club's Full Potential */}
        <Box sx={{ flex: 1, maxWidth: { md: "50%" }, pr: { md: 4 } }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              // color: theme.palette.text.primary // 이미 최상위 Box에서 설정됨
            }}
          >
            Unlock <br /> Your Club's <br /> Full Potential
          </Typography>
        </Box>

        {/* 오른쪽 이미지/소개 글/로그인 버튼 블록 */}
        <Box sx={{ flex: 1, maxWidth: { md: "50%" }, position: "relative", pl: { md: 4 } }}>
         
          <Box sx={{ mt: 4, maxWidth: "500px", ml: { md: "auto" }, textAlign: { xs: "center", md: "right" } }}>
            <Typography variant="body1" sx={{ color: theme.palette.grey[400] || "#AAAAAA", lineHeight: 1.6 }}>
              Let's make club management a strength for your organization. We're here to help with everything from
              member registration and event scheduling to communication and continuous monitoring, ensuring your
              club's growth is always protected.
            </Typography>
            <Button
              variant="contained"
              onClick={initiateGoogleLogin}
              sx={{
                mt: 4,
                backgroundColor: theme.palette.primary.main || "#7B68EE",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark || "#6A5ACD",
                },
                color: theme.palette.primary.contrastText || "#FFFFFF",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              Google 계정으로 로그인
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: theme.palette.grey[600] || "#999999",
          zIndex: 1,
        }}
      >
        <Typography variant="body2">Club Management System</Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;