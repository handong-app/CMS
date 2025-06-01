import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ClubBadge from "../components/ClubPage/ClubBadge";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function ClubPage() {
  const { club } = useParams<{ club: string }>();
  const fetchBe = useFetchBe();

  const { data: clubInfo, isLoading: clubLoading } = useQuery({
    queryKey: ["clubInfo", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}`),
  });

  console.log("Club Info:", clubInfo);

  if (clubLoading) {
    return <Typography>Loading...</Typography>;
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
          title={clubInfo?.clubName || ""}
          subtitle={clubInfo?.description || ""}
          image={clubInfo?.bannerUrl || ""}
        />
      </Box>
      <Box maxWidth={980} margin="auto" mx={2}>
        <Box mt={0.5}>
          <ClubBadge text="2025년도 GBC" />
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
        <Box my={4}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            전체 강의
          </Typography>
          <CourseList />
        </Box>
      </Box>
    </Box>
  );
}

export default ClubPage;
