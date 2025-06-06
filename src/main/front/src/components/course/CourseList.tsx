import { Box } from "@mui/system";
import CourseItem from "./CourseItem";
import { useParams } from "react-router";
import { Grid } from "@mui/material";

export interface CourseListProps {
  courses?: Array<{
    id: string;
    title: string;
    pictureUrl: string;
    progress: number;
    slug: string;
    url?: string;
  }>;
}

function CourseList({ courses }: CourseListProps) {
  const { club } = useParams<{ club: string }>();
  if (!courses || courses.length === 0) return <Box>No courses available</Box>;
  return (
    <Grid container spacing={2}>
      {courses?.map((course, idx) => (
        <Grid
          key={`course-${course?.id}`}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        >
          <CourseItem
            name={course.title}
            picture={course.pictureUrl}
            progress={course.progress}
            url={course.url || `/club/${club}/course/${course.slug}`}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CourseList;
