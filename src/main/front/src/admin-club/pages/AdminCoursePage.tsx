import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../tools/api";
import CourseList from "../../components/course/CourseList";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

function AdminCoursePage() {
  const { club: clubSlug } = useParams<{ club: string }>();
  const fetchBe = useFetchBe();
  const navigate = useNavigate();

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [newCourse, setNewCourse] = React.useState({
    title: "",
    slug: "",
    description: "",
    pictureUrl: "",
    isVisible: true,
  });

  const { data: clubCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["clubCourses", clubSlug],
    queryFn: () => fetchBe(`/v1/clubs/${clubSlug}/courses`),
  });

  // 코스 저장 핸들러 (실제 API 연동 필요)
  const handleSaveCourse = async () => {
    // 실제로는 fetchBe 등으로 POST 요청 필요
    await fetchBe(`/v1/clubs/${clubSlug}/courses`, {
      method: "POST",
      body: newCourse,
    });
    // 여기서는 저장 성공 가정
    setAddDialogOpen(false);
    setTimeout(() => {
      navigate(`/club/${clubSlug}/admin/course/${newCourse.slug}`);
    }, 300);
  };

  if (coursesLoading) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth={1000} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={700}>
            코스 관리
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={(theme) => ({
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            })}
            onClick={() => setAddDialogOpen(true)}
          >
            신규 코스 생성
          </Button>
        </Box>
        {/* 신규 코스 생성 다이얼로그 */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>신규 코스 생성</DialogTitle>
          <DialogContent sx={{ minWidth: 350 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="코스명"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse((c) => ({ ...c, title: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="슬러그"
                value={newCourse.slug}
                onChange={(e) =>
                  setNewCourse((c) => ({ ...c, slug: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="설명"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse((c) => ({ ...c, description: e.target.value }))
                }
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="이미지 URL"
                value={newCourse.pictureUrl}
                onChange={(e) =>
                  setNewCourse((c) => ({ ...c, pictureUrl: e.target.value }))
                }
                fullWidth
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>공개 여부</Typography>
                <Button
                  variant={newCourse.isVisible ? "contained" : "outlined"}
                  onClick={() =>
                    setNewCourse((c) => ({ ...c, isVisible: !c.isVisible }))
                  }
                >
                  {newCourse.isVisible ? "공개" : "비공개"}
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>취소</Button>
            <Button
              variant="contained"
              onClick={handleSaveCourse}
              disabled={
                !newCourse.title || !newCourse.slug || !newCourse.description
              }
            >
              저장
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={3}>
          <CourseList
            courses={clubCourses.map((course: any) => ({
              ...course,
              url: `/club/${clubSlug}/admin/course/${course.slug}`,
            }))}
          />
        </Grid>
      </Paper>
    </Box>
  );
}

export default AdminCoursePage;
