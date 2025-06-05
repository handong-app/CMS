import React from "react";
import TopBanner from "../components/ClubPage/TopBanner";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import ClubBadge from "../components/ClubPage/ClubBadge";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router";
import { currentProgram } from "../utils/currentProgram";
import { formatTimestamp } from "../tools/tools";
import calculateProgress from "../utils/calculateProcess";
import useUserData from "../hooks/userData";
import { courseListParser } from "../utils/courseListParser";
import { getMostRecentNodeGroupForUser } from "../utils/getMostRecentNodeGroupForUser";

function ClubPage() {
  const { club } = useParams<{ club: string }>();
  const fetchBe = useFetchBe();
  const navigate = useNavigate();
  const { userId } = useUserData();
  const [joinModal, setJoinModal] = React.useState<null | { program: any }>(
    null
  );
  const [joinLoading, setJoinLoading] = React.useState(false);
  const [joinError, setJoinError] = React.useState<string | null>(null);

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
  console.log({ calculatedProgramProgress });
  console.log("mostRecentNodeGroup", mostRecentNodeGroup);

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
          <Box mt={0.5}>
            {currentProgram(clubPrograms).map((program) => {
              // program.participants에 내가 없으면 가입 모달 띄우기
              const isParticipant = program.participants?.some(
                (p: any) => p.userId === userId
              );
              const handleProgramClick = (e: React.MouseEvent) => {
                if (!isParticipant) {
                  e.preventDefault();
                  setJoinModal({ program });
                }
              };
              return (
                <Link
                  to={`/club/${club}/program/${program.slug}`}
                  key={program.id}
                  style={{ textDecoration: "none" }}
                  onClick={handleProgramClick}
                >
                  <ClubBadge
                    hoverable
                    text={`${program.name} (진행기간 ${formatTimestamp(
                      program.startDate
                    )} ~ ${formatTimestamp(program.endDate)})`}
                  />
                </Link>
              );
            })}
          </Box>
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
      {/* 가입 모달 */}
      {joinModal && (
        <Dialog open onClose={() => setJoinModal(null)}>
          <DialogTitle>프로그램 등록 필요</DialogTitle>
          <DialogContent>
            <Typography mb={2}>
              이 프로그램에 아직 등록되어 있지 않습니다.
              <br />
              등록 후 이동하시겠습니까?
            </Typography>
            {joinError && (
              <Typography color="error" fontSize={13} mb={1}>
                {joinError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinModal(null)} disabled={joinLoading}>
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={joinLoading}
              onClick={async () => {
                setJoinLoading(true);
                setJoinError(null);
                try {
                  await fetchBe(
                    `/v1/clubs/${club}/programs/${joinModal.program.slug}/join`,
                    {
                      method: "POST",
                    }
                  );
                  setJoinModal(null);
                  navigate(`/club/${club}/program/${joinModal.program.slug}`);
                } catch (e: any) {
                  setJoinError(e?.errorMsg || "등록에 실패했습니다.");
                } finally {
                  setJoinLoading(false);
                }
              }}
            >
              {joinLoading ? "등록 중..." : "등록하고 이동"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ClubPage;
