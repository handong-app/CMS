import { Box } from "@mui/system";
import React from "react";

export interface TopBannerProps {
  title: string;
  subtitle: string;
  image: string;
  altText?: string;
}

const TopBanner: React.FC<TopBannerProps> = ({
  title,
  subtitle,
  image,
  altText,
}) => {
  const computedAlt = altText || `${title} banner`;
  return (
    <Box
      sx={{
        margin: "0 auto",
        position: "relative",
        maxWidth: "100%",
        height: 300,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#222",
      }}
    >
      <img
        src={image}
        alt={computedAlt}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          opacity: 0.6,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 2, padding: "0 2rem" }}>
        <Box
          component="h1"
          sx={{
            color: (theme: any) => theme.palette.common.white,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: 700,
            m: 0,
          }}
        >
          {title}
        </Box>
        <Box
          component="h2"
          sx={{
            color: (theme: any) => theme.palette.grey[100],
            fontSize: { xs: "1rem", sm: "1.2rem" },
            fontWeight: 400,
            m: 0,
          }}
        >
          {subtitle}
        </Box>
      </Box>
    </Box>
  );
};

export default TopBanner;
