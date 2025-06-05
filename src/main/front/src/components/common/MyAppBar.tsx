import { AppBar, Toolbar, Box, Button, Avatar, Typography } from "@mui/material";
import Logo from "../../assets/Logo.png";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

type Props = {
  user: { name: string; photoURL: string } | null;
};

const MyAppBar = ({ user }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/google/client-id");
      if (!res.ok) throw new Error("Client ID fetch failed");

      const clientId = await res.text();
      const redirectUri = encodeURIComponent(window.location.origin + "/google/callback");
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
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ top: 0, left: 0, width: "100%", zIndex: theme.zIndex.appBar }}
    >
      <Toolbar
        sx={{
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <img src={Logo} alt="Logo" style={{ height: 40 }} />
        </Box>

        {user?.name ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body1"
              data-testid="welcome-msg"
              sx={{ fontWeight: 500, color: theme.palette.text.primary }}
            >
              {user.name}님 환영합니다!
            </Typography>
            <Avatar
              alt={user.name}
              src={user.photoURL}
              sx={{ width: 36, height: 36, cursor: "pointer" }}
              onClick={handleAvatarClick}
            />
          </Box>
        ) : (
          <Button variant="contained" color="primary" size="small" onClick={handleGoogleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
