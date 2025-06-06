import TopCourseBanner from "../components/coursePage/TopCourseBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import InfoCard from "../components/coursePage/InfoCard";
import CourseProgressList from "../components/coursePage/CourseProgressList";
import Section from "../components/coursePage/Section";
import SectionCourses from "../components/coursePage/SectionCourses";
import CourseProgress from "../components/course/CourseProgress";
import CoursePageSkeleton from "../components/coursePage/CoursePageSkeleton";
import { useQuery } from "@tanstack/react-query";
import useUserData from "../hooks/userData";
import type { ProgramData, UserProgress } from "../types/process.types";
import calculateProgress from "../utils/calculateProcess";
import { useFetchBe } from "../tools/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { CourseData } from "../types/courseData.types";
import { LatestComment } from "../types/latestComment.types";
import ClubRunningProgramBanner from "../components/ClubPage/ClubRunningProgramBanner";
import { currentProgram } from "../utils/currentProgram";

function CoursePage() {
  const { userId } = useUserData();
  const fetchBe = useFetchBe();
  const { clubSlug, courseSlug } = useParams();
  const navigate = useNavigate();

  // 내 프로그램 리스트
  const { data: myPrograms, isLoading: isMyProgramsLoading } = useQuery<
    { programId: string; clubSlug: string; slug: string }[]
  >({
    queryKey: ["myPrograms"],
    queryFn: () => fetchBe("/v1/user/programs"),
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ["clubPrograms", clubSlug],
    queryFn: () => fetchBe(`/v1/clubs/${clubSlug}/programs`),
  });

  // 현재 club에 해당하는 programSlug 찾기
  const myProgram = (myPrograms ?? []).find((p) => p.clubSlug === clubSlug);
  const programSlug = myProgram?.slug;

  // 프로그램별 유저 진도 데이터
  const { data: programProcess, isLoading: isProgramProcessLoading } =
    useQuery<ProgramData>({
      queryKey: ["programProcess", programSlug],
      queryFn: () =>
        fetchBe(`/v1/clubs/${clubSlug}/programs/${programSlug}/users`),
      enabled: !!programSlug,
    });

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [latestComments, setLatestComments] = useState<LatestComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    if (!clubSlug || !courseSlug) {
      return;
    }

    setIsLoadingCourse(true);
    fetchBe(`/v1/clubs/${clubSlug}/courses/${courseSlug}`)
      .then((data) => {
        setCourseData(data);
      })
      .finally(() => {
        setIsLoadingCourse(false);
      });
  }, [clubSlug, courseSlug, fetchBe]);

  // 최신 댓글 불러오기
  useEffect(() => {
    if (!courseData?.id) return;
    setIsLoadingComments(true);
    fetchBe(`/v1/comments/search?courseId=${courseData.id}`)
      .then((comments: LatestComment[]) => {
        const nodeGroupIds = (courseData.sections ?? []).flatMap((s) =>
          (s.nodeGroups ?? []).map((g) => g.id)
        );
        const nodeIds = (courseData.sections ?? []).flatMap((s) =>
          (s.nodeGroups ?? []).flatMap((g) => (g.nodes ?? []).map((n) => n.id))
        );
        const validTargetIds = [courseData.id, ...nodeGroupIds, ...nodeIds];
        const filtered = Array.isArray(comments)
          ? comments.filter(
              (c) => validTargetIds.includes(c.targetId) && c.content
            )
          : [];
        filtered.sort(
          (a: LatestComment, b: LatestComment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const top10 = filtered.slice(0, 10);
        setLatestComments(top10);
      })
      .catch(() => setLatestComments([]))
      .finally(() => {
        setIsLoadingComments(false);
      });
  }, [courseData?.id, fetchBe, courseData]);

  const isLoading =
    isMyProgramsLoading ||
    isProgramProcessLoading ||
    (isLoadingCourse && !courseData) ||
    (isLoadingComments && !latestComments);

  if (isLoading) {
    return <CoursePageSkeleton />;
  }

  // 진도율 계산 및 내 진도 정보
  let myProgress = null;
  if (courseData && programProcess) {
    const calculatedProgress: UserProgress[] =
      calculateProgress(programProcess);
    myProgress = calculatedProgress.find((u) => u.userId === userId);
  }

  // 진도율 계산
  let percent = 0,
    completed = 0,
    total = 0;
  if (courseData && myProgress) {
    const courseId = courseData.id;
    const courseProgress = myProgress.courseProgress[courseId];
    completed = courseProgress?.completed ?? 0;
    total = courseProgress?.total ?? 0;
    percent = total > 0 ? Math.round((completed / total) * 1000) / 10 / 100 : 0;
  }

  const filteredPrograms = currentProgram(programs ?? []);
  console.log(filteredPrograms);

  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <ClubRunningProgramBanner club={clubSlug} sx={{ mb: 2 }} />
      <TopCourseBanner
        title={courseData?.title ?? ""}
        producer={courseData?.creatorName ?? ""}
        courseDescription={courseData?.description ?? ""}
        image={courseData?.pictureUrl ?? ""}
        onContinue={() => {
          if (!programProcess || !courseData || !userId) {
            alert("진행중인 강의가 없습니다.");
            return;
          }

          const userData = Array.isArray(programProcess.participants)
            ? programProcess.participants.find((p) => p.userId === userId)
            : Array.isArray(programProcess)
            ? programProcess.find((u) => u.userId === userId)
            : null;

          if (!userData?.courses) {
            alert("진행중인 강의가 없습니다.");
            return;
          }

          const course = userData.courses.find(
            (c: { courseId: string }) => c.courseId === courseData.id
          );
          if (!course?.nodeGroups) {
            alert("진행중인 강의가 없습니다.");
            return;
          }

          const latestInProgressGroup = course.nodeGroups
            .filter(
              (g: { progress?: { state?: string; lastSeenAt?: string } }) =>
                g.progress?.state === "IN_PROGRESS" && g.progress?.lastSeenAt
            )
            .sort(
              (
                a: { progress: { lastSeenAt: string } },
                b: { progress: { lastSeenAt: string } }
              ) =>
                new Date(b.progress.lastSeenAt).getTime() -
                new Date(a.progress.lastSeenAt).getTime()
            )[0];

          if (latestInProgressGroup) {
            navigate(
              `/club/${clubSlug}/course/${courseSlug}/nodegroup/${latestInProgressGroup.nodeGroupId}`
            );
          } else {
            alert("진행중인 강의가 없습니다.");
          }
        }}
      />

      <Box display="flex" mt={2}>
        <CourseProgressList
          courseTitle={courseData?.title ?? ""}
          sections={(courseData?.sections ?? []).map((section) => ({
            ...section,
            nodeGroups: (section.nodeGroups ?? []).map((group) => {
              // nodeGroup 완료 여부 및 진행중 여부 계산
              let isCompleted = false;
              let isInProgress = false;
              if (courseData && myProgress) {
                const courseId = courseData.id;
                const courseProgress = myProgress.courseProgress[courseId];
                if (courseProgress?.map) {
                  const state = courseProgress.map?.[group.id];
                  isCompleted = state === "DONE";
                  isInProgress = state === "IN_PROGRESS";
                }
              }
              return {
                ...group,
                isCompleted,
                isInProgress,
              };
            }),
          }))}
          width={260}
        />

        <Box width="100%">
          <Box display="flex" justifyContent="space-between" ml={2}>
            <InfoCard
              title="학습 현황"
              content={
                <>
                  <Typography variant="body2">
                    지금까지 학습한 진도율을 확인하세요.
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    {filteredPrograms.length === 0 ||
                    filteredPrograms.every((p) => p.isParticipant === "0") ? (
                      <Typography variant="body2" color="error">
                        진행중인 프로그램이 없습니다.
                      </Typography>
                    ) : (
                      <>
                        <Box width={86}>
                          <CourseProgress value={percent} />
                        </Box>
                        <Box
                          ml={2}
                          bgcolor={"#f0f0f010"}
                          p={1}
                          borderRadius={1}
                        >
                          <Typography variant="body2">진도율</Typography>
                          <Typography variant="body2">
                            {completed}/{total}
                          </Typography>
                        </Box>
                        <Box
                          ml={1}
                          bgcolor={"#f0f0f010"}
                          p={1}
                          borderRadius={1}
                        >
                          <Typography variant="body2">남은 강의</Typography>
                          <Typography variant="body2">
                            {total - completed}개
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </>
              }
              width={270}
              height={200}
            />
            <InfoCard
              title={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <span>최신 반응</span>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#7da0fa",
                      cursor: "pointer",
                      fontWeight: 500,
                      userSelect: "none",
                      ml: 2,
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => alert("댓글 페이지로 이동!")}
                    data-testid="more-comments"
                  >
                    댓글 더보기
                  </Typography>
                </Box>
              }
              content={
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={0.2}
                  sx={{
                    maxHeight: 140,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.08) transparent",
                  }}
                >
                  {(latestComments ?? []).map((comment, index) => (
                    <Box
                      key={comment.id || index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        transition: "background 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(255,255,255,0.08)",
                        },
                      }}
                    >
                      <Box display="flex">
                        <Typography
                          variant="body2"
                          mr={1}
                          sx={{ color: "#d7e2ffdb" }}
                        >
                          {comment.userName || "-"}
                        </Typography>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </Box>

                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: "gray",
                          ml: 1,
                          minWidth: 70,
                          textAlign: "right",
                        }}
                      >
                        {comment.createdAt?.slice(0, 10) || ""}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              }
              width={470}
              height={200}
            />
          </Box>

          <Box ml={2}>
            <Box>
              {(courseData?.sections ?? []).map((section) => (
                <Box key={section.id} mt={1}>
                  <Section text={section.title} />
                  {(section.nodeGroups ?? []).map((group) => (
                    <Box mt={1.6} key={group.id}>
                      <SectionCourses
                        title={group.title}
                        description={section.description}
                        nodes={
                          Array.isArray(group.nodes)
                            ? group.nodes?.map((node) => {
                                let title = "";
                                switch (node.type) {
                                  case "VIDEO":
                                  case "IMAGE":
                                  case "FILE":
                                  case "TEXT":
                                    title = node.data?.title ?? "";
                                    break;
                                  case "QUIZ":
                                    title = node.data?.question ?? "";
                                    break;
                                  default:
                                    title = "";
                                }
                                return {
                                  id: node.id,
                                  type:
                                    node.type === "FILE"
                                      ? "doc"
                                      : (node.type.toLowerCase() as
                                          | "video"
                                          | "image"
                                          | "quiz"
                                          | "doc"
                                          | "file"
                                          | "text"),
                                  title,
                                };
                              })
                            : []
                        }
                        onTitleClick={() => {
                          console.log("group id", group.id);
                          if (clubSlug && courseSlug && group.id) {
                            navigate(
                              `/club/${clubSlug}/course/${courseSlug}/nodegroup/${group.id}`
                            );
                          }
                        }}
                        onNodeClick={() => {
                          if (clubSlug && courseSlug && group.id) {
                            navigate(
                              `/club/${clubSlug}/course/${courseSlug}/nodegroup/${group.id}`
                            );
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CoursePage;
