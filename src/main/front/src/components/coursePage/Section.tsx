import React from "react";
import { Typography, Paper } from "@mui/material";

export interface SectionProps {
  text: string;
}

const Section: React.FC<SectionProps> = ({ text }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        background: "rgba(250, 250, 250, 0.14)",
        color: "#fff",
        borderRadius: 2,
        mt: 1,
        px: 1.5,
        py: 0.5,
        fontSize: 15,
        fontWeight: 500,
        minHeight: 48,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        component="span"
        sx={{ fontWeight: 500, fontSize: 15, color: "inherit" }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

export default Section;
