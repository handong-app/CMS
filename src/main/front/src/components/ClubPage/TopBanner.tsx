import Box from "@mui/material/Box";
import React from "react";
import { Theme } from "@mui/material/styles";

export interface TopBannerProps {
  title: string;
  subtitle: string;
  image: string;
  textJustify?: React.CSSProperties["textAlign"];
  height?: number;
  altText?: string;
}

const TopBanner: React.FC<TopBannerProps> = ({
  title,
  subtitle,
  image,
  height = 300,
  textJustify = "center",
  altText,
}) => {
  const computedAlt = altText || `${title} banner`;
  const [imgError, setImgError] = React.useState(false);
  return (
    <Box
      data-testid="top-banner"
      sx={{
        margin: "0 auto",
        position: "relative",
        maxWidth: "100%",
        height,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: textJustify,
        background: "#222",
      }}
    >
      {!imgError ? (
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
          onError={() => setImgError(true)}
        />
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#333",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
          }}
        >
          <span style={{ color: "#fff", fontSize: "1.2rem" }}>
            Image not available
          </span>
        </Box>
      )}
      <Box sx={{ position: "relative", zIndex: 2, padding: "0 2rem" }}>
        <Box
          component="h1"
          sx={{
            color: (theme: Theme) => theme.palette.common.white,
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
            color: (theme: Theme) => theme.palette.grey[100],
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
