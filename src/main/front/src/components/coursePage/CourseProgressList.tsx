import type { CourseData } from "../../types/courseData.types";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// CourseData 타입을 기반으로 props 타입 정의
export interface CourseProgressListProps {
  courseTitle: string;
  sections: CourseData["sections"];
  width?: number | string;
  // isCompleted 계산 로직이 필요하면 prop으로 함수 전달도 가능
}

const CourseProgressList: React.FC<CourseProgressListProps> = ({
  courseTitle,
  sections,
  width = "100%",
}) => {
  return (
    <Card
      sx={{
        width,
        color: "#fff",
        borderRadius: 2,
        boxSizing: "border-box",
        boxShadow: 2,
        p: 2,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: 16, mb: 0.6 }}
        >
          {courseTitle}
        </Typography>
        <List dense disablePadding>
          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mt: 0.6, mb: 0.6 }}
                    >
                      {section.title}
                    </Typography>
                  }
                />
              </ListItem>
              {(section.nodeGroups ?? []).map((nodeGroup) => {
                const completed =
                  "isCompleted" in nodeGroup &&
                  typeof nodeGroup.isCompleted === "boolean"
                    ? nodeGroup.isCompleted
                    : false;
                return (
                  <ListItem
                    key={nodeGroup.id}
                    disablePadding
                    sx={{ pl: 1, mb: 0.6 }}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      {completed ? (
                        <CheckCircleIcon
                          data-testid="CheckCircleIcon"
                          sx={{ color: "#4caf50" }}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          data-testid="RadioButtonUncheckedIcon"
                          sx={{ color: "#888" }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={nodeGroup.title} />
                  </ListItem>
                );
              })}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CourseProgressList;
