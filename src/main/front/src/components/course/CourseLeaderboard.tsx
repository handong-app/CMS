import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Button,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { formatTimestampRelativeOrAbsolute } from "../../tools/tools";
import { useState } from "react";

export interface CourseLeaderboardItem {
  name: string;
  progress: number; // 0~100
  lastStudiedAt: string; // ISO string or yyyy-MM-dd HH:mm
}

export interface CourseLeaderboardProps {
  items?: CourseLeaderboardItem[];
}

const defaultItems: CourseLeaderboardItem[] = [
  {
    name: "김리더",
    progress: 98,
    lastStudiedAt: "2025-05-29T09:10:00",
  },
  {
    name: "박열정",
    progress: 85,
    lastStudiedAt: "2025-05-28T22:10:00",
  },
  {
    name: "이성실",
    progress: 70,
    lastStudiedAt: "2025-05-28T20:00:00",
  },
  {
    name: "최꾸준",
    progress: 60,
    lastStudiedAt: "2025-05-27T18:30:00",
  },
  {
    name: "정새싹",
    progress: 40,
    lastStudiedAt: "2025-05-26T15:00:00",
  },
  {
    name: "오열심",
    progress: 55,
    lastStudiedAt: "2025-05-27T10:45:00",
  },
  {
    name: "유도전",
    progress: 35,
    lastStudiedAt: "2025-05-25T14:20:00",
  },
  {
    name: "임성장",
    progress: 80,
    lastStudiedAt: "2025-05-28T19:00:00",
  },
  {
    name: "문새벽",
    progress: 25,
    lastStudiedAt: "2025-05-24T07:30:00",
  },
  {
    name: "장도전",
    progress: 50,
    lastStudiedAt: "2025-05-26T21:10:00",
  },
  {
    name: "배지각",
    progress: 65,
    lastStudiedAt: "2025-05-27T23:55:00",
  },
  {
    name: "신성실",
    progress: 90,
    lastStudiedAt: "2025-05-29T08:00:00",
  },
  {
    name: "황근면",
    progress: 30,
    lastStudiedAt: "2025-05-25T09:40:00",
  },
  {
    name: "서노력",
    progress: 45,
    lastStudiedAt: "2025-05-26T18:15:00",
  },
  {
    name: "조성취",
    progress: 20,
    lastStudiedAt: "2025-05-23T16:00:00",
  },
];

interface HighlightOptions {
  myName?: string;
}

function CourseLeaderboard({
  items,
  myName,
}: CourseLeaderboardProps & HighlightOptions) {
  const [showAll, setShowAll] = useState(false);
  // 정렬: 학습율 내림차순, 동점이면 마지막 학습 최근순
  const data = (items && items.length > 0 ? items : defaultItems)
    .slice()
    .sort((a, b) => {
      if (b.progress !== a.progress) return b.progress - a.progress;
      return (
        new Date(b.lastStudiedAt).getTime() -
        new Date(a.lastStudiedAt).getTime()
      );
    });

  // 내 등수 찾기
  const myIdx = myName ? data.findIndex((row) => row.name === myName) : -1;
  // 꼴등(마지막) 인덱스
  const lastIdx = data.length - 1;

  // 보여줄 row: 1등, 2등, 3등, 내 등수(중복X), 꼴등(중복X) 또는 전체
  let showIdxArr: number[];
  if (showAll) {
    showIdxArr = Array.from({ length: data.length }, (_, i) => i);
  } else {
    const showIdxSet = new Set<number>();
    for (let i = 0; i < Math.min(3, data.length); ++i) showIdxSet.add(i);
    if (myIdx >= 0 && !showIdxSet.has(myIdx)) showIdxSet.add(myIdx);
    if (lastIdx >= 0 && !showIdxSet.has(lastIdx)) showIdxSet.add(lastIdx);
    showIdxArr = Array.from(showIdxSet).sort((a, b) => a - b);
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography
          variant="h6"
          fontWeight={700}
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ flex: 1 }}
        >
          <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 22 }} /> 리더보드
        </Typography>
        {data.length > 5 && (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              minWidth: 80,
              fontWeight: 500,
              borderRadius: 2,
              py: 0.5,
              px: 1.5,
              fontSize: 14,
            }}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "간략히" : "전체보기"}
          </Button>
        )}
      </Box>
      <TableContainer
        component={Paper}
        sx={{ background: "rgba(255,255,255,0.04)", boxShadow: 0 }}
      >
        <Table size="small" aria-label="leaderboard table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: "#FFD700", width: 40 }}
              >
                #
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: "1%" }}>이름</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: "100%" }}>
                학습율
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: "1%" }}>
                마지막 학습
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showIdxArr.map((idx) => {
              const row = data[idx];
              const isMyRow = myIdx === idx;
              const isTop = idx === 0;
              const isLast = idx === lastIdx;
              // 내가 꼴등이면 더 강한 빨간색 강조
              const isMeAndLast = isMyRow && isLast;
              return (
                <TableRow
                  key={row.name}
                  sx={{
                    ...(isMeAndLast
                      ? { background: "rgba(255, 0, 0, 0.18)" }
                      : isMyRow
                      ? { background: "rgba(0,82,204,0.18)" }
                      : isTop
                      ? { background: "rgba(255,215,0,0.10)" }
                      : isLast
                      ? { background: "rgba(255,0,0,0.08)" }
                      : {}),
                    transition: "background 0.2s",
                    "&:hover": {
                      background: isMeAndLast
                        ? "rgba(255, 0, 0, 0.28)"
                        : isMyRow
                        ? "rgba(0,82,204,0.28)"
                        : isTop
                        ? "rgba(255,215,0,0.18)"
                        : isLast
                        ? "rgba(255,0,0,0.16)"
                        : "rgba(255,255,255,0.10)",
                      cursor: "default",
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: isTop ? 700 : isMyRow ? 700 : 400,
                      color: isTop
                        ? "#FFD700"
                        : isMyRow
                        ? (theme) => theme.palette.primary.main
                        : undefined,
                    }}
                  >
                    {idx + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: isTop || isMyRow ? 700 : 400,
                      color: isMyRow
                        ? (theme) => theme.palette.primary.main
                        : undefined,
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {row.name}
                    {isMyRow && (
                      <span
                        style={{
                          marginLeft: 6,
                          color: "#7AB8FF",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        (나)
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ flex: 1, minWidth: 60 }}>
                        <LinearProgress
                          variant="determinate"
                          value={row.progress}
                          sx={{
                            width: "100%",
                            height: 8,
                            borderRadius: 4,
                            background: "rgba(255,255,255,0.15)",
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 32, ml: 1 }}>
                        {row.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#b0b0b0", whiteSpace: "nowrap" }}
                  >
                    {formatTimestampRelativeOrAbsolute(row.lastStudiedAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
export default CourseLeaderboard;
