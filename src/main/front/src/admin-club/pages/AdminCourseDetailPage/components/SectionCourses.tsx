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
  clubSlug?: string;
  courseSlug?: string;
  nodeGroupId: string;
  nodes: Node[];
  onMove?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
}

const iconMap = {
  video: <VideoLibraryIcon />,
  doc: <DescriptionIcon />,
  file: <DescriptionIcon />,
  text: <DescriptionIcon />,
  quiz: <QuizIcon />,
  image: <ImageIcon />,
};

import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const SectionCourses: React.FC<SectionCoursesProps> = ({
  title,
  description,
  nodes,
  onMove,
  onDelete,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
  clubSlug = "",
  courseSlug = "",
  nodeGroupId,
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={0.2}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          onClick={() => {
            window.open(
              `/club/${clubSlug}/course/${courseSlug}/nodegroup/${nodeGroupId}`,
              "_blank"
            );
          }}
          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
        >
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          {onMoveUp && (
            <Tooltip title="위로 이동">
              <span>
                <IconButton
                  size="small"
                  onClick={onMoveUp}
                  disabled={disableMoveUp}
                  sx={{ color: "#fff" }}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {onMoveDown && (
            <Tooltip title="아래로 이동">
              <span>
                <IconButton
                  size="small"
                  onClick={onMoveDown}
                  disabled={disableMoveDown}
                  sx={{ color: "#fff" }}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {onMove && (
            <Tooltip title="노드 그룹 수정">
              <IconButton size="small" sx={{ color: "#fff" }} onClick={onMove}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onDelete && (
            <Tooltip title="노드 그룹 삭제">
              <IconButton
                size="small"
                sx={{ color: "#e53935" }}
                onClick={onDelete}
              >
                <AddIcon fontSize="small" sx={{ transform: "rotate(45deg)" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
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
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                borderRadius: 2,
                pb: 1,
                pt: 1,
              }}
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
