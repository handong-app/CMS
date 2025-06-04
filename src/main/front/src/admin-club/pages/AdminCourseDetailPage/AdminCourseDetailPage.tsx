import AddSectionButton from "./AddSectionButton";
import { useParams } from "react-router";
import { useFetchBe } from "../../../tools/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box } from "@mui/material";
import SectionList from "./SectionList";

import React, { useEffect } from "react";

function AdminCourseDetailPage() {
  const { club: clubId, courseSlug } = useParams<{
    club: string;
    courseSlug: string;
  }>();

  const fetchBe = useFetchBe();
  const queryClient = useQueryClient();

  const [sections, setSections] = React.useState<any[]>([]);
  const {
    data: courseData,
    isLoading: clubCourseLoading,
    refetch,
  } = useQuery({
    queryKey: ["clubCourses", clubId, courseSlug],
    queryFn: () => fetchBe(`/v1/clubs/${clubId}/courses/${courseSlug}`),
  });

  const refreshSections = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["clubCourses", clubId, courseSlug],
    });
  };

  useEffect(() => {
    if (
      courseData &&
      typeof courseData === "object" &&
      "sections" in courseData
    ) {
      setSections((courseData as any).sections ?? []);
    }
  }, [courseData]);

  // section 추가 핸들러
  const handleAddSection = async (section: {
    title: string;
    description: string;
    order: number;
  }) => {
    try {
      await fetchBe(`/v1/clubs/${clubId}/courses/${courseSlug}/sections`, {
        method: "POST",
        body: section,
      });
      await refetch();
      // refetch 후 최신 데이터로 sections 갱신
      // (courseData는 비동기적으로 업데이트되므로, useEffect에서 처리)
    } catch (e) {
      alert("섹션 추가 실패: " + (e as any)?.message);
    }
  };

  console.log("AdminCourseDetailPage sections", sections);

  if (clubCourseLoading) return <div>Loading...</div>;
  return (
    <div>
      <div>
        <h1>AdminCourseDetailPage</h1>
        <p>Club ID: {clubId}</p>
        <p>Course Slug: {courseSlug}</p>
      </div>
      <div>
        <Box ml={2}>
          <SectionList sections={sections} refreshSections={refreshSections} />
        </Box>
        <AddSectionButton onAddSection={handleAddSection} />
      </div>
    </div>
  );
}

export default AdminCourseDetailPage;
