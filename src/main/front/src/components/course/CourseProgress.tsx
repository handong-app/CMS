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
      value={normalizedValue}
      maxValue={1}
      text={`${Math.round(normalizedValue * 100)}%`}
      /* …기존의 다른 props… */
    />
  );
}

export default CourseProgress;

function CourseProgress({ value }: CourseProgressProps) {
  const theme = useTheme();

  return (
    <CircularProgressbar
      value={value}
      maxValue={1}
      text={`${value * 100}%`}
      styles={buildStyles({
        // Import useTheme from MUI
        pathColor: theme.palette.primary.main,
        textColor: theme.palette.text.primary,
        trailColor: theme.palette.grey[300],
        backgroundColor: theme.palette.background.paper,
      })}
    />
  );
}

export default CourseProgress;
