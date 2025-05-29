import Box from "@mui/material/Box";
import React from "react";
import { Theme } from "@mui/material/styles";

export interface TopBannerProps {
  title: string;
  producer: string;
  image: string;
  altText?: string;
  courseDiscription?: string;
  onContinue: () => void;
}

const TopCourseBanner: React.FC<TopBannerProps> = ({
  title,
  producer,
  image,
  altText,
  courseDiscription,
  onContinue,
}) => {
  const computedAlt = altText || `${title} banner`;
  const [imgError, setImgError] = React.useState(false);
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
        background: "#111",
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
            opacity: 0.5,
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
          component="h2"
          sx={{
            color: (theme: Theme) => theme.palette.grey[100],
            fontSize: 14,
            fontWeight: 400,
            m: 0,
          }}
        >
          {producer}
        </Box>
        <Box
          component="h1"
          sx={{
            color: (theme: Theme) => theme.palette.common.white,
            fontSize: 32,
            fontWeight: 600,
            m: 0,
          }}
        >
          {title}
        </Box>

        <Box
          component="h4"
          sx={{
            color: (theme: Theme) => theme.palette.grey[100],
            fontSize: 16,
            fontWeight: 500,
            marginTop: 1,
            maxWidth: 600,
          }}
        >
          {courseDiscription}
        </Box>
      </Box>
      <Box
        onClick={onContinue}
        sx={{
          ml: 2,
          px: 2,
          py: 1,
          position: "absolute",
          right: 30,
          bottom: 30,
          zIndex: 2,
          borderRadius: 2,
          background: "#3876e3",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          width: 160,
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          "&:hover": {
            background: "#2c5bb3",
            color: "#ffffffc0",
          },
        }}
      >
        Continue Learning
      </Box>
    </Box>
  );
};

export default TopCourseBanner;
