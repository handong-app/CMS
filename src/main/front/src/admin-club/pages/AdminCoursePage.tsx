import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { Link, useParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import CourseItem, {
  CourseItemProps,
} from "../../components/course/CourseItem";
import { useQuery } from "@tanstack/react-query";
import { fetchBe, useFetchBe } from "../../tools/api";
import CourseList from "../../components/course/CourseList";

function AdminCoursePage() {
  const { club: clubId } = useParams<{ club: string }>();

  const fetchBe = useFetchBe();

  const { data: clubCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["clubCourses", clubId],
    queryFn: () => fetchBe(`/v1/clubs/${clubId}/courses`),
  });

  if (coursesLoading) return <Typography>Loading...</Typography>;
  console.log(clubCourses);

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
          >
            신규 코스 생성
          </Button>
        </Box>
        <Grid container spacing={3}>
          <CourseList
            courses={clubCourses.map((course: any) => ({
              ...course,
              url: `/club/${clubId}/admin/course/${course.id}/edit`,
            }))}
          />
        </Grid>
      </Paper>
    </Box>
  );
}

export default AdminCoursePage;
