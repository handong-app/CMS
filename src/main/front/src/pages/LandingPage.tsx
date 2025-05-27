import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {initiateGoogleLogin} from "../utils/auth"; // 구글 로그인 함수 위치에 맞게 조정

const LandingPage: React.FC = () => {
  
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 64px)" // AppBar 높이 제외
        textAlign="center"
        px={2}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          랜딩페이지가 생길 예정
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          이미지로 넣는게 편해보임
        </Typography>
        <Typography variant="h6" gutterBottom>
          소개 글이나 온보딩 관련 글 ㅋㅋ
        </Typography>

        <Box mt={4}>
          <Button variant="contained" onClick={initiateGoogleLogin}>
            구글 계정으로 로그인
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;
