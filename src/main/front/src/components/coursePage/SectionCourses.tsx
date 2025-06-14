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
  type: "video" | "doc" | "quiz" | "image" | "file" | "text";
  title: string;
}

export interface SectionCoursesProps {
  title: string;
  description: string;
  nodes: Node[];
  onTitleClick?: () => void;
  onNodeClick?: (nodeId: string) => void;
}

const iconMap = {
  video: <VideoLibraryIcon />,
  doc: <DescriptionIcon />,
  file: <DescriptionIcon />,
  text: <DescriptionIcon />,
  quiz: <QuizIcon />,
  image: <ImageIcon />,
};

const SectionCourses: React.FC<SectionCoursesProps> = ({
  title,
  description,
  nodes,
  onTitleClick,
  onNodeClick,
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
      <Typography
        variant="subtitle1"
        fontWeight={600}
        mb={0.2}
        sx={{ cursor: onTitleClick ? "pointer" : "default" }}
        onClick={onTitleClick}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {description}
      </Typography>
      <List dense>
        {!nodes || nodes.length === 0 ? (
          <ListItem sx={{ pl: 0 }}>
            <ListItemText
              primary="콘텐츠가 없습니다."
              sx={{ color: "gray", pl: 0, ml: 0 }}
            />
          </ListItem>
        ) : (
          nodes.map((node) => (
            <ListItem
              key={node.id}
              sx={{
                pl: 0,
                cursor: onNodeClick ? "pointer" : "default",
                "&:hover": {
                  backgroundColor: onNodeClick
                    ? "rgba(255, 255, 255, 0.1)"
                    : undefined,
                },
                borderRadius: 2,
                pb: 1,
                pt: 1,
              }}
              onClick={onNodeClick ? () => onNodeClick(node.id) : undefined}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {iconMap[node.type] ?? <DescriptionIcon />}
              </ListItemIcon>
              <ListItemText primary={node.title} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default SectionCourses;
