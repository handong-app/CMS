import { useTheme } from "@mui/material";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CourseProgressProps {
  value: number;
}

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
