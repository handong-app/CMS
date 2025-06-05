import AddSectionButton from "./AddSectionButton";
import { useParams } from "react-router";
import { useFetchBe } from "../../../tools/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button } from "@mui/material";
import CourseBannerUploadBox from "../../components/CourseBannerUploadBox";
import SectionList from "./SectionList";
import React, { useEffect, useState } from "react";

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
      // 섹션 order 정렬 및 nodeGroups도 order 정렬
      const sortedSections = ((courseData as any).sections ?? [])
        .slice()
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        .map((section: any) => ({
          ...section,
          nodeGroups: Array.isArray(section.nodeGroups)
            ? section.nodeGroups
                .slice()
                .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
                .map((group: any) => ({
                  ...group,
                  nodes: Array.isArray(group.nodes)
                    ? group.nodes
                        .slice()
                        .sort(
                          (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
                        )
                    : [],
                }))
            : [],
        }));
      setSections(sortedSections);
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
    } catch (e) {
      alert("섹션 추가 실패: " + (e as any)?.message);
    }
  };

  // 배너 이미지 업로드 완료 시 refetch만 수행
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
      <Box mb={3} width="100%">
        <CourseBannerSection
          pictureUrl={courseData?.pictureUrl}
          courseId={courseData?.id || ""}
          onComplete={handleBannerUploadComplete}
        />
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

// 강의 배너 이미지 full width & 수정 버튼 UX 분리 컴포넌트
interface CourseBannerSectionProps {
  pictureUrl?: string;
  courseId: string;
  onComplete: () => void;
}
const CourseBannerSection: React.FC<CourseBannerSectionProps> = ({
  pictureUrl,
  courseId,
  onComplete,
}) => {
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  return (
    <Box width="100%" mx="auto">
      {pictureUrl ? (
        <>
          <Box position="relative" width="100%">
            <img
              src={pictureUrl}
              alt="배너 이미지"
              style={{
                width: "100%",
                height: 240,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#eee",
              }}
            />
            <Button
              variant="outlined"
              size="small"
              sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
              onClick={() => setShowBannerUpload(true)}
            >
              수정
            </Button>
          </Box>
          {showBannerUpload && (
            <Box mt={2}>
              <CourseBannerUploadBox
                targetId={courseId}
                targetType="course-banner"
                onComplete={async () => {
                  setShowBannerUpload(false);
                  onComplete();
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <CourseBannerUploadBox
          targetId={courseId}
          targetType="course-banner"
          onComplete={onComplete}
        />
      )}
    </Box>
  );
};

export default AdminCourseDetailPage;
