import { useTheme } from "@mui/material";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CourseProgressProps {
  /** 진행률 값 (0.0 ~ 1.0 사이의 값) */
  value: number;
}

function CourseProgress({ value }: CourseProgressProps) {
  const theme = useTheme();

  // value가 0-1 범위를 벗어나는 경우 경고 및 보정
  const normalizedValue = Math.max(0, Math.min(1, value));

  if (value !== normalizedValue) {
    console.warn(
      `CourseProgress: value는 0-1 사이여야 합니다. 받은 값: ${value}, 보정된 값: ${normalizedValue}`
    );
  }

  return (
    <CircularProgressbar
      value={value}
      maxValue={1}
      text={`${Math.round(value * 10000) / 100}%`}
      styles={buildStyles({
        pathColor: theme.palette.primary.main,
        textColor: theme.palette.text.primary,
        trailColor: theme.palette.grey[300],
        backgroundColor: theme.palette.background.paper,
      })}
      aria-label="학습 진행률"
      aria-valuenow={Math.round(normalizedValue * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

export default CourseProgress;
