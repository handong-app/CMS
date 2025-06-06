import { useQuery } from "@tanstack/react-query";
import { Typography, Box } from "@mui/material";
import { useFetchBe } from "../tools/api";
import ClubThumbnailList from "../components/ClubThumbnailList";

function ClubListPage() {
  const fetchBe = useFetchBe();
  const {
    data: clubs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => fetchBe("/v1/clubs"),
  });

  if (isLoading) return <Typography align="center">로딩 중...</Typography>;
  if (error) return <Typography color="error">에러 발생</Typography>;

  return (
    <Box mt={6} mb={8} p={2}>
      <Typography variant="h4" fontWeight={700} align="center" mb={4}>
        동아리 목록
      </Typography>
      <ClubThumbnailList clubs={clubs} />
    </Box>
  );
}

export default ClubListPage;
