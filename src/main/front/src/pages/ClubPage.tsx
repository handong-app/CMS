import TopBanner from "../components/ClubPage/TopBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ClubBadge from "../components/ClubPage/ClubBadge";
import ContinueNodeGroup from "../components/course/ContinueNodeGroup";
import CourseList from "../components/course/CourseList";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { currentProgram } from "../utils/currentProgram";
import { formatTimestamp } from "../tools/tools";

function ClubPage() {
  const { club } = useParams<{ club: string }>();
  const fetchBe = useFetchBe();

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

  console.log("Club Info:", clubInfo);

  if (clubLoading || programsLoading || coursesLoading) {
    return <Typography>Loading...</Typography>;
  }

  console.log("Club Programs:", clubPrograms);

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
      <Box maxWidth={1012} width="100%" margin="auto" px={2}>
        <Box mt={0.5}>
          {currentProgram(clubPrograms).map((program) => (
            <Link
              to={`/club/${club}/program/${program.slug}`}
              key={program.id}
              style={{ textDecoration: "none" }}
            >
              <ClubBadge
                hoverable
                text={`${program.name} (진행기간 ${formatTimestamp(
                  program.startDate
                )} ~ ${formatTimestamp(program.endDate)})`}
              />
            </Link>
          ))}
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
          <CourseList courses={clubCourses || []} />
        </Box>
      </Box>
    </Box>
  );
}

export default ClubPage;
