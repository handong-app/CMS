import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

export interface CourseItemProps {
  name: string;
  picture: string;
  progress: number;
}

const CourseItem: React.FC<CourseItemProps> = ({ name, picture, progress }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        position: "relative",
        overflow: "hidden",
        transition:
          "transform 0.18s cubic-bezier(.4,1.3,.5,1), box-shadow 0.18s cubic-bezier(.4,1.3,.5,1)",
        boxShadow: 3,
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px) scale(1.025)",
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        component="img"
        image={picture}
        alt={`${name} 코스 이미지`}
        sx={{ height: 220, width: "100%", objectFit: "cover" }}
      />
      {/* Overlay for text and progress */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 100,
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          padding: "16px 16px 12px 16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            color: "#fff",
            mb: 1,
            fontSize: name.length > 15 ? "1rem" : undefined,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            transition: "font-size 0.2s",
          }}
          title={name}
        >
          {name}
        </Typography>
        <LinearProgress
          variant="determinate"
          aria-label={`${name} 코스 진행률 ${progress}%`}
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            background: "rgba(255,255,255,0.2)",
            mb: 1,
          }}
        />
        {/* <Typography
          variant="body2"
          sx={{ color: "#fff", textAlign: "right", fontWeight: 500 }}
        >
          {progress}%
        </Typography> */}
      </div>
    </Card>
  );
};

export default CourseItem;
