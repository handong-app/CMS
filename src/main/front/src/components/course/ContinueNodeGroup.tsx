import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
} from "@mui/material";

export interface ContinueNodeGroupProps {
  theme: "light" | "dark";
  courseName: string;
  lessonName: string;
  onContinue: () => void;
  thumbnail?: string;
  lastViewedAt?: string;
}

const ContinueNodeGroup: React.FC<ContinueNodeGroupProps> = ({
  theme,
  courseName,
  lessonName,
  onContinue,
  thumbnail,
  lastViewedAt,
}) => {
  const isDark = theme === "dark";
  return (
    <Card
      sx={{
        width: "100%",
        margin: "auto",
        borderRadius: 3,
        boxShadow: 6,
        background: isDark
          ? "linear-gradient(135deg, #23243a 60%, #181818 100%)"
          : "#fff",
        color: isDark ? "#fff" : "#222",
        p: 0,
      }}
    >
      <CardActionArea
        onClick={onContinue}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          gap: 2,
        }}
      >
        {thumbnail && (
          <CardMedia
            component="img"
            image={thumbnail}
            alt="course thumbnail"
            sx={{
              width: 96,
              height: 96,
              borderRadius: 2,
              objectFit: "cover",
              boxShadow: isDark ? 4 : 1,
            }}
          />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: isDark ? "#b0b0b0" : "#888",
              fontWeight: 500,
              mb: 0.5,
            }}
            noWrap
          >
            {courseName}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 0.5, color: isDark ? "#fff" : "#222" }}
            noWrap
          >
            {lessonName}
          </Typography>
          {lastViewedAt && (
            <Typography
              variant="body2"
              sx={{ color: isDark ? "#b0b0b0" : "#888" }}
            >
              Last viewed: {lastViewedAt}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            ml: 2,
            px: 2,
            py: 1,
            borderRadius: 2,
            background: isDark ? "#333" : "#f5f5f5",
            color: isDark ? "#fff" : "#222",
            fontWeight: 600,
            fontSize: 16,
            minWidth: 80,
            textAlign: "center",
            boxShadow: isDark ? 2 : 0,
          }}
        >
          Continue
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ContinueNodeGroup;
