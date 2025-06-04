import AddSectionButton from "./AddSectionButton";
import { useParams } from "react-router";
import { useFetchBe } from "../../../tools/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box } from "@mui/material";
import CourseBannerUploadBox from "../../components/CourseBannerUploadBox";
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

  // 배너 이미지 업로드 완료 시 refetch만 수행 (upload-complete는 CourseBannerUploadBox에서 처리)
  const handleBannerUploadComplete = async () => {
    await refetch();
  };

  if (clubCourseLoading) return <div>Loading...</div>;
  return (
    <div>
      <div>
        <h1>AdminCourseDetailPage</h1>
        <p>Club ID: {clubId}</p>
        <p>Course Slug: {courseSlug}</p>
      </div>
      <Box mb={3} maxWidth={400}>
        <CourseBannerUploadBox
          targetId={courseData?.id || ""}
          targetType="course-banner"
          onComplete={handleBannerUploadComplete}
        />
        {courseData?.pictureUrl && (
          <Box mt={2}>
            <img
              src={courseData.pictureUrl}
              alt="배너 이미지"
              style={{
                width: "100%",
                maxHeight: 120,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}
      </Box>
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
