import { Box } from "@mui/system";
import CourseItem from "./CourseItem";
import { id } from "date-fns/locale";
import { url } from "inspector";
import { useParams } from "react-router";

export interface CourseListProps {
  courses?: Array<{
    name: string;
    picture: string;
    progress: number;
  }>;
}

const defaultCourses = [
  {
    id: 1,
    title: "리액트 해킹",
    pictureUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    progress: 70,
    url: "https://reactjs.org",
  },
  {
    id: 2,
    title: "TypeScript Advanced",
    pictureUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    progress: 40,
    url: "https://www.typescriptlang.org/",
  },
  {
    id: 3,
    title: "UI/UX Design",
    pictureUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    progress: 90,
    url: "https://www.figma.com/",
  },
];

function CourseList({ courses }: CourseListProps) {
  const { club } = useParams<{ club: string }>();

  const data = courses && courses.length > 0 ? courses : defaultCourses;
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {data.map((course: any, idx) => (
        <CourseItem
          key={`course-${course?.id || idx}`}
          name={course.title}
          picture={course.pictureUrl}
          progress={course.progress || 0}
          url={course.slug ? `/club/${club}/course/${course.slug}` : course.url}
        />
      ))}
    </Box>
  );
}

export default CourseList;
