import React from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import QuizIcon from "@mui/icons-material/Quiz";
import ImageIcon from "@mui/icons-material/Image";

export interface Node {
  id: string;
  type: "video" | "doc" | "quiz" | "image";
  title: string;
}

export interface SectionCoursesProps {
  title: string;
  description: string;
  nodes: Node[];
}

const iconMap = {
  video: <VideoLibraryIcon />,
  doc: <DescriptionIcon />,
  quiz: <QuizIcon />,
  image: <ImageIcon />,
};

const SectionCourses: React.FC<SectionCoursesProps> = ({
  title,
  description,
  nodes,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        background: "rgba(250, 250, 250, 0.035)",
        borderRadius: 2,
        mt: 1,
        px: 2,
        py: 1.5,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} mb={0.2}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {description}
      </Typography>

      <List dense>
        {nodes.map((node) => (
          <ListItem
            key={node.id}
            sx={{
              pl: 0,
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              borderRadius: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {iconMap[node.type]}
            </ListItemIcon>
            <ListItemText primary={node.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SectionCourses;
