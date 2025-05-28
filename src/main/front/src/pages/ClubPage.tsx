import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ClubBadge from "../components/ClubPage/ClubBadge";

function ClubPage() {
  return (
    <Box maxWidth={980} margin="auto">
      <TopBanner
        title="Club Name"
        subtitle="Welcome to the club"
        image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920"
      />
      <Box display="flex">
        <Box flexGrow={2} sx={{ padding: "1rem" }}>
          <Typography variant="h5" sx={{ margin: "0", padding: "0" }}>
            진행중인 프로그램
          </Typography>
          <ClubBadge text="2025년도 GBC" />
        </Box>
        <Box flexGrow={1} sx={{ padding: "1rem" }}>
          <Typography variant="h5" sx={{ margin: "0", padding: "0" }}>
            진행중인 프로그램
          </Typography>
          <ClubBadge text="2025년도 GBC" />
        </Box>
      </Box>
    </Box>
  );
}

export default ClubPage;
