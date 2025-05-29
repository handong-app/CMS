import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import CourseProgress from "../components/course/CourseProgress";
import CourseLeaderboard from "../components/course/CourseLeaderboard";

function ProgramPage() {
  return (
    <Box maxWidth={980} margin="auto" px={3}>
      <TopBanner
        title="GBC 2025년도 프로그램"
        subtitle="함께 성장하는 GBC 2025년도 프로그램에 오신 것을 환영합니다!"
        height={150}
        textJustify="start"
        image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920"
      />

      <Box
        sx={{
          flexBasis: "50%",
          width: "100%",
          my: 2,
          p: 2,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        }}
      >
        <CourseLeaderboard myName="서노력" />
      </Box>

      <Box display={"flex"} gap={5} mt={2} p={3}>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Typography variant="h5" fontWeight={700} align="left">
            학습상황
          </Typography>
          <Box width={150} mt={2}>
            <CourseProgress value={0.45} />
          </Box>
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box sx={{ mb: 2, alignSelf: "flex-start" }}>
            <Typography variant="h5" fontWeight={700}>
              마지막으로 본 강의
            </Typography>
          </Box>
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
            />
          </Box>
        </Box>
      </Box>

      <Box my={4}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          포함된 강의
        </Typography>
        <CourseList />
      </Box>
    </Box>
  );
}

export default ProgramPage;
