import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import CourseProgress from "../components/course/CourseProgress";
import CourseLeaderboard from "../components/course/CourseLeaderboard";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import calculateProgress from "../utils/calculateProcess";
import useUserData from "../hooks/userData";
import { courseListParser } from "../utils/courseListParser";

import { getMostRecentNodeGroupForUser } from "../utils/getMostRecentNodeGroupForUser";

function ProgramPage() {
  const { club, program_name } = useParams<{
    club: string;
    program_name: string;
  }>();

  const fetchBe = useFetchBe();
  const navigate = useNavigate();

  const { userId } = useUserData();

  const { data: programInfo, isLoading: programLoading } = useQuery({
    queryKey: ["programInfo", program_name],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs/${program_name}`),
  });

  const { data: programProcess, isLoading: programProcessLoading } = useQuery({
    queryKey: ["programProcess", program_name],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs/${program_name}/users`),
  });

  if (programLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  const calculatedProgramProgress = calculateProgress(
    programProcess || { participants: [] }
  );

  const myProgress = calculatedProgramProgress.find(
    (user) => user.userId === userId
  );

  // 가장 최근 노드그룹 정보 추출
  const mostRecentNodeGroup = getMostRecentNodeGroupForUser(
    userId || "",
    programProcess?.participants || []
  );

  return (
    <Box
      display="flex"
      justifyContent={"center"}
      flexDirection="column"
      alignItems="center"
    >
      <Box width="100%" maxWidth={980}>
        <TopBanner
          title={programInfo?.name}
          subtitle={programInfo?.description}
          height={150}
          textJustify="start"
          image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920"
        />
      </Box>
      <Box maxWidth={1012} margin="auto" px={2} width="100%">
        <Box
          display="flex"
          my={2}
          gap={2}
          sx={{
            alignItems: "stretch",
            cursor: "default",
          }}
        >
          {/* 왼쪽: 학습현황 */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            width="30%"
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-around"
              width="100%"
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 3,
                boxShadow: 6,
                p: 2,
              }}
            >
              <Box width={96}>
                <CourseProgress
                  value={
                    Math.round(
                      ((myProgress?.programProgress.completed || 0) /
                        (myProgress?.programProgress.total || 1)) *
                        100
                    ) / 100
                  }
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="body1" color="text.secondary" mb={1}>
                  남은 강의
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {(myProgress?.programProgress.total || 0) -
                    (myProgress?.programProgress.completed || 0)}
                  개
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* 오른쪽: 마지막 진도 */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            flexGrow={1}
          >
            <Box
              display="flex"
              flexGrow={1}
              alignItems="center"
              width="100%"
              justifyContent="center"
            >
              {mostRecentNodeGroup ? (
                <ContinueNodeGroup
                  theme="dark"
                  courseName={mostRecentNodeGroup.courseTitle || "강의 없음"}
                  lessonName={mostRecentNodeGroup.nodeGroupTitle}
                  lastViewedAt={mostRecentNodeGroup.lastSeenAt}
                  thumbnail={
                    programInfo?.courses?.find?.(
                      (course: any) =>
                        course.id === mostRecentNodeGroup.courseId
                    )?.pictureUrl
                  }
                  onContinue={() => {
                    // 강의 이동
                    navigate(
                      `/club/${club}/course/${mostRecentNodeGroup.courseId}/nodegroup/${mostRecentNodeGroup.nodeGroupId}`
                    );
                  }}
                  background="rgba(255, 255, 255, 0.05)"
                />
              ) : (
                <Typography variant="h6" color="text.secondary">
                  강의를 시작해보세요
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flexBasis: "50%",
            width: "100%",
            my: 2,
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <CourseLeaderboard
            myUserId={userId || ""}
            items={calculatedProgramProgress.map((user) => ({
              userId: user.userId,
              name:
                programProcess.participants.find(
                  (p: any) => p.userId === user.userId
                )?.participantName || user.userId,
              progress:
                user.programProgress.total > 0
                  ? Math.round(
                      (user.programProgress.completed /
                        user.programProgress.total) *
                        100
                    )
                  : 0,
              lastStudiedAt: user.programProgress.lastSeenAt || "0",
            }))}
          />

          {/* 가장 마지막 학습 시간 표시 */}
          {programProcess &&
            (() => {
              const progressArr = calculateProgress(programProcess);
              const allLastSeen = progressArr
                .map((u) => u.programProgress.lastSeenAt)
                .filter(Boolean);
              const lastSeen =
                allLastSeen.length > 0
                  ? allLastSeen.sort(
                      (a, b) => new Date(b!).getTime() - new Date(a!).getTime()
                    )[0]
                  : null;
              return lastSeen ? (
                <Box mt={2} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    전체 마지막 학습: {lastSeen}
                  </Typography>
                </Box>
              ) : null;
            })()}
        </Box>

        <Box my={4}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            포함된 강의
          </Typography>
          <CourseList
            courses={courseListParser(programInfo?.courses, myProgress)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ProgramPage;
