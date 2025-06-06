import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ClubRunningProgramBanner from "../components/ClubPage/ClubRunningProgramBanner";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { currentProgram } from "../utils/currentProgram";
import calculateProgress from "../utils/calculateProcess";
import useUserData from "../hooks/userData";
import { courseListParser } from "../utils/courseListParser";
import { getMostRecentNodeGroupForUser } from "../utils/getMostRecentNodeGroupForUser";

function ClubPage() {
  const { club } = useParams<{ club: string }>();
  const fetchBe = useFetchBe();
  const navigate = useNavigate();
  const { userId } = useUserData();
  // 가입 모달 관련 상태 제거 (ClubProgramList로 이동)

  const { data: clubInfo, isLoading: clubLoading } = useQuery({
    queryKey: ["clubInfo", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}`),
  });

  const { data: clubPrograms, isLoading: programsLoading } = useQuery({
    queryKey: ["clubPrograms", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs`),
  });

  const { data: clubCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["clubCourses", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}/courses`),
  });

  const getFirstCurrentProgram = currentProgram(clubPrograms || [])[0];
  const { data: clubProgramProcess, isLoading: clubProgramProcessLoading } =
    useQuery({
      queryKey: ["clubProgramProcess", getFirstCurrentProgram?.slug],
      queryFn: () =>
        fetchBe(
          `/v1/clubs/${club}/programs/${getFirstCurrentProgram?.slug}/users`
        ),
      enabled: !!getFirstCurrentProgram?.slug,
    });

  if (
    clubLoading ||
    programsLoading ||
    coursesLoading ||
    clubProgramProcessLoading
  ) {
    return <Typography>Loading...</Typography>;
  }

  const calculatedProgramProgress = calculateProgress(
    clubProgramProcess || { participants: [] }
  );

  const myProgress = calculatedProgramProgress.find(
    (user) => user.userId === userId
  );

  const mostRecentNodeGroup = getMostRecentNodeGroupForUser(
    userId || "",
    clubProgramProcess?.participants || []
  );

  return (
    <>
      <Box
        display="flex"
        justifyContent={"center"}
        flexDirection="column"
        alignItems="center"
      >
        <Box width="100%" maxWidth={980}>
          <TopBanner
            title={clubInfo?.clubName || ""}
            subtitle={clubInfo?.description || ""}
            image={clubInfo?.bannerUrl || ""}
          />
        </Box>
        <Box maxWidth={1012} width="100%" margin="auto" px={2}>
          {club && <ClubRunningProgramBanner club={club} />}
          {mostRecentNodeGroup && (
            <Box mt={4}>
              <Typography variant="h5" fontWeight={700} mb={2}>
                마지막으로 본 강의
              </Typography>
              <ContinueNodeGroup
                courseName={mostRecentNodeGroup?.courseTitle || "강의 없음"}
                lessonName={mostRecentNodeGroup?.nodeGroupTitle}
                lastViewedAt={mostRecentNodeGroup?.lastSeenAt}
                thumbnail={
                  clubCourses?.find(
                    (course: { id: string; pictureUrl: string }) =>
                      course.id === mostRecentNodeGroup.courseId
                  )?.pictureUrl
                }
                onContinue={() => {
                  navigate(
                    `/club/${club}/course/${mostRecentNodeGroup.courseId}/nodegroup/${mostRecentNodeGroup.nodeGroupId}`
                  );
                }}
                theme={"dark"}
              />
            </Box>
          )}
          <Box my={4}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              전체 강의
            </Typography>
            <CourseList courses={courseListParser(clubCourses, myProgress)} />
          </Box>
        </Box>
      </Box>
      {/* 가입 모달은 ClubProgramList 내부로 이동 */}
    </>
  );
}

export default ClubPage;
