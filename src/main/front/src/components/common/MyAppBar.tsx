import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Typography,
  AppBarOwnProps,
} from "@mui/material";
import Logo from "../../assets/Logo.png"; // 로고 이미지 경로 확인
import { useTheme } from "@mui/material/styles";
import useUserData from "../../hooks/userData";
import { Link } from "react-router";

import { useNavigate } from "react-router";

const MyAppBar = ({
  position = "fixed",
  transparent = false,
}: {
  position?: AppBarOwnProps["position"];
  transparent?: boolean;
}) => {
  const user = useUserData();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch("api/auth/google/client-id");
      if (!res.ok) throw new Error("Client ID fetch failed");

      const clientId = await res.text();
      const redirectUri = encodeURIComponent(
        window.location.origin + "/google/callback"
      );
      const scope = encodeURIComponent("openid email profile");

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent`;

      window.location.href = authUrl;
    } catch (err) {
      console.error("구글 로그인 오류:", err);
      alert("구글 로그인에 실패했습니다.");
    }
  };

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  return (
    // position을 "fixed"로 변경하여 앱 바를 화면 상단에 고정
    // elevation을 0으로 설정하여 AppBar 자체의 그림자를 제거 (Toolbar에서 관리)
    <AppBar
      position={position}
      color="default"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        zIndex: theme.zIndex.appBar,
        backgroundColor: transparent
          ? "transparent"
          : theme.palette.background.default,
        boxShadow: transparent ? "none" : "0px 1px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          backdropFilter: transparent ? "none" : "blur(10px)",
          // 'textcolor'는 올바른 속성이 아닙니다. 'color'로 변경하여 텍스트 색상을 테마에서 가져오도록 합니다.
          color: theme.palette.text.primary, // 툴바 내부의 기본 텍스트 색상
          backgroundColor: transparent
            ? "transparent"
            : theme.palette.background.default, // 툴바의 배경색
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Link to="/club">
          <Box display="flex" alignItems="center">
            <img src={Logo} alt="Logo" style={{ height: 40 }} />
          </Box>
        </Link>

        {user?.name ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body1"
              data-testid="welcome-msg"
              sx={{ fontWeight: 500, color: theme.palette.text.primary }}
            >
              {user.name}님 환영합니다!
            </Typography>
            {/* <Avatar
              alt={user.name}
              src={user.photoURL}
              sx={{ width: 36, height: 36, cursor: "pointer" }}
              onClick={handleAvatarClick}
            /> */}
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleGoogleLogin}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
