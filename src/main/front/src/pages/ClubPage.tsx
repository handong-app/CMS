import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ClubBadge from "../components/ClubPage/ClubBadge";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";

function ClubPage() {
  return (
    <Box maxWidth={980} margin="auto">
      <TopBanner
        title="Club Name"
        subtitle="Welcome to the club"
        image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920"
      />
      <Box display="flex" mt={2} sx={{ width: "100%", maxWidth: "100%" }}>
        <Box
          mt={1}
          sx={{
            flexBasis: "33.333%",
            flexGrow: 0,
            flexShrink: 0,
            padding: "1rem",
            minWidth: 0,
            maxWidth: "33.333%",
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h5" gutterBottom>
            진행중인 프로그램
          </Typography>
          <ClubBadge text="2025년도 GBC" />
        </Box>
        <Box
          sx={{
            flexBasis: "66.666%",
            flexGrow: 0,
            flexShrink: 0,
            padding: "1rem",
            minWidth: 0,
            maxWidth: "66.666%",
            boxSizing: "border-box",
          }}
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
  );
}

export default ClubPage;
