import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export interface ClubBadgeProps {
  text: string;
  hoverable?: boolean;
  noEmoji?: boolean;
  background?: React.CSSProperties["background"];
}

const ClubBadge: React.FC<ClubBadgeProps> = ({
  text,
  hoverable,
  noEmoji,
  background,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        background: background || "rgba(250, 250, 250, 0.14)",
        color: "#fff",
        borderRadius: 2,
        mt: 1,
        px: 1.5,
        py: 0.5,
        fontSize: 15,
        fontWeight: 500,
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.12)",
        minHeight: 48,
        width: "100%",
        boxSizing: "border-box",
        transition: hoverable
          ? "background 0.18s, box-shadow 0.18s, transform 0.18s"
          : undefined,
        cursor: hoverable ? "pointer" : undefined,
        ...(hoverable
          ? {
              "&:hover": {
                background: "rgba(255, 255, 255, 0.22)",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.18)",
              },
            }
          : {}),
      }}
    >
      {!noEmoji && (
        <EmojiEventsIcon sx={{ fontSize: 18, mr: 0.5, color: "#ffd700" }} />
      )}
      <Typography
        component="span"
        sx={{ fontWeight: 500, fontSize: 15, color: "inherit" }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

export default ClubBadge;
