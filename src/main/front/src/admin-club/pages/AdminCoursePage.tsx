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
  const [isSaving, setIsSaving] = React.useState(false);

  const { data: clubCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["clubCourses", clubSlug],
    queryFn: () => fetchBe(`/v1/clubs/${clubSlug}/courses`),
  });

  // 코스 저장 핸들러 (실제 API 연동 필요)
  const handleSaveCourse = async () => {
    setIsSaving(true);
    try {
      await fetchBe(`/v1/clubs/${clubSlug}/courses`, {
        method: "POST",
        body: newCourse,
      });
      setAddDialogOpen(false);
      setTimeout(() => {
        navigate(`/club/${clubSlug}/admin/course/${newCourse.slug}`);
      }, 300);
    } catch (e) {
      alert(e instanceof Error ? e.message : "코스 저장 중 오류 발생");
    } finally {
      setIsSaving(false);
    }
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
                  setNewCourse((c) => ({
                    ...c,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                helperText="영문 소문자, 숫자, 하이픈만 사용 가능"
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
            <Button onClick={() => setAddDialogOpen(false)} disabled={isSaving}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveCourse}
              disabled={
                isSaving ||
                !newCourse.title ||
                !newCourse.slug ||
                !newCourse.description
              }
            >
              {isSaving ? (
                <>
                  <span style={{ marginRight: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 50 50">
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="5"
                        strokeDasharray="31.4 31.4"
                        strokeLinecap="round"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </span>
                  저장 중...
                </>
              ) : (
                "저장"
              )}
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
