import React from "react";
import CourseItem from "../components/course/CourseItem";

function ProgramPage() {
  const dummyCourses = [
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
  return (
    <div style={{ display: "flex", gap: 24 }}>
      {dummyCourses.map((course, idx) => (
        <CourseItem
          key={course.name + idx}
          name={course.name}
          picture={course.picture}
          progress={course.progress}
        />
      ))}
    </div>
  );
}

export default ProgramPage;
