import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import CourseProgress from "../components/course/CourseProgress";
import CourseLeaderboard from "../components/course/CourseLeaderboard";

function ProgramPage() {
  return (
    <Box maxWidth={980} margin="auto">
      <TopBanner
        title="Program Name"
        subtitle="Welcome to the program"
        height={150}
        textJustify="start"
        image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920"
      />

      <Box
        sx={{
          flexBasis: "50%",
          width: "100%",
          my: 1,
          p: 2,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        }}
      >
        <CourseLeaderboard myName="서노력" />
      </Box>

      <Box display={"flex"} gap={3} mt={1}>
        <Box
          sx={{
            my: 1,
            p: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            학습상황
          </Typography>
          <Box width={150} mt={2}>
            <CourseProgress value={0.3} />
          </Box>
        </Box>
        <Box mt={4}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            마지막으로 본 강의
          </Typography>
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
