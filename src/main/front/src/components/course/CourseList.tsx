import { Box } from "@mui/system";
import CourseItem from "./CourseItem";

export interface CourseListProps {
  courses?: Array<{
    name: string;
    picture: string;
    progress: number;
  }>;
}

const defaultCourses = [
  {
    name: "리액트 해킹",
    picture: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    progress: 70,
  },
  {
    name: "TypeScript Advanced",
    picture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    progress: 40,
  },
  {
    name: "UI/UX Design",
    picture: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    progress: 90,
  },
];

function CourseList({ courses }: CourseListProps) {
  const data = courses && courses.length > 0 ? courses : defaultCourses;
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {data.map((course, idx) => (
        <CourseItem
          key={`course-${idx}-${course.name}`}
          name={course.name}
          picture={course.picture}
          progress={course.progress}
        />
      ))}
    </Box>
  );
}

export default CourseList;
