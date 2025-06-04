import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { initiateGoogleLogin } from "../utils/auth";
import LottieBackground from '../components/LandingPage/LottieBackground';

const LandingPage: React.FC = () => {
  const theme = useTheme(); 
  const appBarHeight = `${theme.mixins.toolbar.minHeight}px`;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default || "#1A1A1A",
        minHeight: "100vh",
        color: theme.palette.text.primary || "#FFFFFF",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <LottieBackground appBarHeight={appBarHeight} />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          paddingTop: appBarHeight, 
          minHeight: `calc(100vh - ${appBarHeight})`, 
          textAlign: { xs: "center", md: "left" },
          maxWidth: "1600px",
          mx: "auto",
          px: 1,
          gap: 4,
          pt: { xs: 4, md: 0 },
          position: 'relative',
          zIndex: 1, 
        }}
      >
        <Box sx={{ flex: 1, maxWidth: { md: "50%" }, pr: { md: 4 } }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
            }}
          >
            Unlock <br /> Your Club's <br /> Full Potential
          </Typography>
        </Box>

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