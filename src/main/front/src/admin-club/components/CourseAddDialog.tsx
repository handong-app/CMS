import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import { Grid } from "@mui/material";
import { CourseItem } from "./AdminProgramEdit";

export interface CourseAddDialogProps {
  open: boolean;
  onClose: () => void;
  allCourses: CourseItem[];
  courses: CourseItem[];
  onAdd: (course: CourseItem) => void;
}

const CourseAddDialog: React.FC<CourseAddDialogProps> = ({
  open,
  onClose,
  allCourses,
  courses,
  onAdd,
}) => {
  // 추가 가능한 코스와 이미 추가된 코스 분리
  const addedIds = new Set(courses.map((c) => c.id));
  const availableCourses = allCourses?.filter((c) => !addedIds.has(c.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>코스 추가</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          추가 가능한 코스
        </Typography>
        <Grid container spacing={2} mb={2}>
          {availableCourses?.length === 0 && (
            <Grid sx={{ xs: 12 }}>
              <Typography color="text.secondary">
                추가 가능한 코스가 없습니다.
              </Typography>
            </Grid>
          )}
          {availableCourses?.map((course) => (
            <Grid width="100%" key={course.id}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                p={2}
                borderRadius={2}
                sx={{
                  border: "1.5px solid #eee",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  // "&:hover": { background: "rgba(245, 245, 245, 0.32)" },
                }}
                // onClick={() => onAdd(course)}
              >
                <Avatar
                  src={course.pictureUrl || undefined}
                  alt={course.title}
                  sx={{ width: 48, height: 48, bgcolor: "#e0e0e0" }}
                >
                  {course.title?.[0] || "?"}
                </Avatar>
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={600} noWrap>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {course.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {course.slug}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => onAdd(course)}
                >
                  추가
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography variant="subtitle1" fontWeight={600} mb={1} mt={2}>
          이미 추가된 코스
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {courses.length === 0 && (
            <Typography color="text.secondary">
              추가된 코스가 없습니다.
            </Typography>
          )}
          {courses.map((course) => (
            <Chip
              key={course.id}
              label={course.title}
              avatar={
                <Avatar src={course.pictureUrl || undefined}>
                  {course.title?.[0] || "?"}
                </Avatar>
              }
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseAddDialog;
