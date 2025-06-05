import { Box } from "@mui/system";
import CourseItem from "./CourseItem";
import { useParams } from "react-router";

export interface CourseListProps {
  courses?: Array<{
    id: string;
    title: string;
    pictureUrl: string;
    progress: number;
    slug: string;
  }>;
}

function CourseList({ courses }: CourseListProps) {
  const { club } = useParams<{ club: string }>();
  if (!courses || courses.length === 0) return <Box>No courses available</Box>;
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {courses?.map((course, idx) => (
        <CourseItem
          key={`course-${course?.id}`}
          name={course.title}
          picture={course.pictureUrl}
          progress={course.progress}
          url={`/club/${club}/course/${course.slug}`}
        />
      ))}
    </Box>
  );
}

export default CourseList;
