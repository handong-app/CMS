import { AppBar, Toolbar, Box, Button, Avatar } from "@mui/material";
import Logo from "../../assets/Logo.png"; // 경로는 위치에 따라 조정하세요

type Props = {
  user: { name: string; photoURL: string } | null;
};

const MyAppBar = ({ user }: Props) => {
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

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ 
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          justifyContent: "space-between", px: 2 
        }}>
        <Box display="flex" alignItems="center">
          <img src={Logo} alt="Logo" style={{ height: 40 }} />
        </Box>

        {user && user.name ? (
          <Box display="flex" alignItems="center" gap={1}>
            <span style={{ fontWeight: 500 }}>{user.name}님 환영합니다!</span>
            <Avatar alt={user.name} src={user.photoURL} sx={{ width: 36, height: 36 }} />
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
