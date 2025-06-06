import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { currentProgram } from "../../utils/currentProgram";
import { useFetchBe } from "../../tools/api";
import useUserData from "../../hooks/userData";
import { useState } from "react";
import ClubBadge from "./ClubBadge";
import { formatTimestamp } from "../../tools/tools";
import JoinProgramModal from "./JoinProgramModal";

import { BoxProps } from "@mui/system";

export interface ClubRunningProgramBannerProps extends BoxProps {
  club?: string;
}

function ClubRunningProgramBanner({
  club,
  ...props
}: ClubRunningProgramBannerProps) {
  const fetchBe = useFetchBe();
  const navigate = useNavigate();
  const { userId } = useUserData();
  const [joinModal, setJoinModal] = useState<null | { program: any }>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const { data: clubPrograms, isLoading: programsLoading } = useQuery({
    queryKey: ["clubPrograms", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs`),
    staleTime: 1000 * 30, // 30초동안 유효처리
    enabled: !!club, // club이 있을 때만 실행
  });

  if (!club) return <></>;

  // currentProgram 적용
  const filteredPrograms = currentProgram(clubPrograms);

  const handleProgramClick = (program: any) => (e: React.MouseEvent) => {
    if (program.isParticipant !== "1") {
      e.preventDefault();
      setJoinModal({ program });
    }
  };

  const handleJoin = async () => {
    if (!joinModal) return;
    setJoinLoading(true);
    setJoinError(null);
    try {
      await fetchBe(
        `/v1/clubs/${club}/programs/${joinModal.program.slug}/join`,
        { method: "POST" }
      );
      setJoinModal(null);
      navigate(`/club/${club}/program/${joinModal.program.slug}`);
    } catch (e: any) {
      setJoinError(e?.errorMsg || "등록에 실패했습니다.");
    } finally {
      setJoinLoading(false);
    }
  };

  if (programsLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Box mt={0.5} {...props}>
        {filteredPrograms.map((program: any) => {
          const isParticipant = program.isParticipant === "1";
          return (
            <Link
              to={`/club/${club}/program/${program.slug}`}
              key={program.id}
              style={{ textDecoration: "none" }}
              onClick={handleProgramClick(program)}
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
      <JoinProgramModal
        open={!!joinModal}
        onClose={() => setJoinModal(null)}
        loading={joinLoading}
        error={joinError}
        onJoin={handleJoin}
      />
    </>
  );
}

export default ClubRunningProgramBanner;
