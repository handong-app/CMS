import React from "react";
import { Box, Grid } from "@mui/material";
import ClubThumbnail, { ClubThumbnailProps } from "./ClubThumbnail";

export interface ClubThumbnailListProps {
  clubs?: ClubThumbnailProps[];
}

export function ClubThumbnailList({ clubs }: ClubThumbnailListProps) {
  const data = clubs && clubs.length > 0 ? clubs : [];
  // 가입된 동아리 먼저, 미가입 동아리 나중에 정렬
  const sorted = [...data].sort((a, b) => {
    if (a.isMember && !b.isMember) return -1;
    if (!a.isMember && b.isMember) return 1;
    return 0;
  });
  return (
    <Box width="100%" maxWidth={1100} mx="auto">
      <Grid container spacing={2}>
        {sorted.map((club) => (
          <Grid key={club.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ClubThumbnail {...club} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ClubThumbnailList;
