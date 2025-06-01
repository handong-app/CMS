import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export interface InfoCardProps {
  title: React.ReactNode;
  content: React.ReactNode;
  width?: number | string;
  height?: number | string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  width = "100%",
  height = "auto",
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        width,
        height,
        // background: "rgba(250, 250, 250, 0.14)",
        background: "rgba(250, 250, 250, 0.035)",
        color: "#fff",
        borderRadius: 2,
        boxSizing: "border-box",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
        {title}
      </Typography>
      <CardContent sx={{ p: 0 }}>{content}</CardContent>
    </Card>
  );
};

export default InfoCard;
