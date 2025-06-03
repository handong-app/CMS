import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import CourseProgress from "../components/course/CourseProgress";
import CourseLeaderboard from "../components/course/CourseLeaderboard";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useUserProgram from "../hooks/userProgram";

function ProgramPage() {
  const { club, program_name } = useParams<{
    club: string;
    program_name: string;
  }>();

  const fetchBe = useFetchBe();

  const { programs } = useUserProgram();

  // TODO: 프로그램 진행도 불러오기
  console.log("프로그램:", programs);

  const { data: programInfo, isLoading: programLoading } = useQuery({
    queryKey: ["programInfo", program_name],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs/${program_name}`),
  });
  console.log(programInfo);
  if (programLoading) {
    return <Typography>로딩 중...</Typography>;
  }
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
      <Box maxWidth={980} margin="auto" px={2} width="100%">
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
                <CourseProgress value={0.45} />
              </Box>
              <Box textAlign="center">
                <Typography variant="body1" color="text.secondary" mb={1}>
                  남은 강의
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  28개
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
              <ContinueNodeGroup
                theme="dark"
                courseName="React Basics"
                lessonName="Hooks and State"
                onContinue={() => alert("Continue to last lesson!")}
                thumbnail="https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
                lastViewedAt="2025-05-28 22:10"
                background="rgba(255, 255, 255, 0.05)"
              />
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
          <CourseLeaderboard myName="서노력" />
        </Box>

        <Box my={4}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            포함된 강의
          </Typography>
          <CourseList courses={programInfo?.courses || []} />
        </Box>
      </Box>
    </Box>
  );
}

export default ProgramPage;
