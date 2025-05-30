import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { Link, useParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import CourseItem, {
  CourseItemProps,
} from "../../components/course/CourseItem";

export interface AdminCoursePageProps {
  courses?: CourseItemProps[];
}

const defaultCourses: CourseItemProps[] = [
  {
    courseId: "course1",
    name: "리액트 해킹",
    picture: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  },
  {
    courseId: "course2",
    name: "TypeScript Advanced",
    picture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    courseId: "course3",
    name: "UI/UX Design",
    picture: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
];

function AdminCoursePage({ courses }: AdminCoursePageProps) {
  const data = courses ?? defaultCourses;
  const { club: clubId } = useParams<{ club: string }>();
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
          {data.map((course) => (
            <Grid key={course.name} size={{ xs: 12, sm: 6, md: 4 }}>
              {/* 실제로는 course에 slug나 id가 있어야 함. 예시에서는 name을 사용 */}
              <Link
                to={`/club/${clubId}/admin/course/get/${course.courseId}`}
                style={{ textDecoration: "none" }}
              >
                <CourseItem {...course} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default AdminCoursePage;
