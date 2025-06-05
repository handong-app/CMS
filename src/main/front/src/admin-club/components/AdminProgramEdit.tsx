import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import CourseAddDialog from "./CourseAddDialog";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import AdminClubMemberTable from "./AdminClubMemberTable";
import { ClubMember } from "../../types/clubmember.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useFetchBe } from "../../tools/api";

export interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  pictureUrl: string | null;
  isVisible: number;
  creatorUserId: string;
  sections: any[] | null;
}

export interface AdminProgramEditProps {
  initialName?: string;
  initialDescription?: string;
  initialCourses?: (string | CourseItem)[];
  initialSlug?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  isEditMode?: boolean;
  onSave?: (data: {
    name: string;
    description: string;
    courses: (string | CourseItem)[];
    slug: string;
    startDate: string;
    endDate: string;
  }) => void;
  enrolledMembers?: ClubMember[]; // 수강중인 회원 목록
}

export interface AdminProgramEditProps {
  initialName?: string;
  initialDescription?: string;
  initialCourses?: (string | CourseItem)[];
  initialSlug?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  isEditMode?: boolean;
  onSave?: (data: {
    name: string;
    description: string;
    courses: (string | CourseItem)[];
    slug: string;
    startDate: string;
    endDate: string;
  }) => void;
  enrolledMembers?: ClubMember[]; // 수강중인 회원 목록
}

const AdminProgramEdit: React.FC<AdminProgramEditProps> = ({
  initialName = "",
  initialDescription = "",
  initialCourses = [],
  initialSlug = "",
  initialStartDate = "",
  initialEndDate = "",
  isEditMode = false,
  onSave,
  enrolledMembers,
}) => {
  const { club, programSlug } = useParams<{
    club?: string;
    programSlug?: string;
  }>();

  const queryClient = useQueryClient();

  const fetchBe = useFetchBe();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [slug, setSlug] = useState(initialSlug);
  const [startDate, setStartDate] = useState(
    initialStartDate ? new Date(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? new Date(initialEndDate) : null
  );

  const { data: courseList, isLoading: coursesLoading } = useQuery({
    queryKey: ["clubCourses", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}/courses`),
    enabled: !!programSlug, // programSlug가 있을 때만 호출
  });
  console.log("courses", courseList);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  if (coursesLoading) return <Typography>로딩 중...</Typography>;

  // courses는 CourseItem[]으로 관리
  const courses = initialCourses?.map((c) =>
    typeof c === "string"
      ? courseList.find((ac: any) => ac.id === c || ac.title === c) || {
          id: c,
          title: c,
          slug: c,
          description: "",
          pictureUrl: null,
          isVisible: 1,
          creatorUserId: "",
          sections: null,
        }
      : c
  );

  // 코스 추가
  const handleAddCourse = async (course: CourseItem) => {
    console.log("Add Course", course);

    await fetchBe(
      `/v1/clubs/${club}/programs/${programSlug}/add-course/${course.slug}`,
      {
        method: "POST",
      }
    );
    queryClient.invalidateQueries({
      queryKey: ["clubPrograms", club, programSlug],
    });
  };

  // 저장
  const handleSave = () => {
    onSave?.({
      name,
      description,
      courses,
      slug,
      startDate: startDate ? formatDateTime(startDate) : "",
      endDate: endDate ? formatDateTime(endDate) : "",
    });
  };

  // YYYY-MM-DDTHH:mm:ss 포맷으로 변환
  function formatDateTime(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  }

  return (
    <Box maxWidth={600} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          프로그램 정보 수정
        </Typography>

        <TextField
          label="프로그램 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="슬러그"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          disabled={isEditMode}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="시작일"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            ampm={false}
            slotProps={{
              textField: { fullWidth: true, sx: { mb: 2 } },
            }}
          />
          <DateTimePicker
            label="종료일"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            ampm={false}
            slotProps={{
              textField: { fullWidth: true, sx: { mb: 2 } },
            }}
          />
        </LocalizationProvider>
        <TextField
          label="프로그램 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mb: 1 }}
        />
        {isEditMode && (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                포함 코스
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                코스 추가
              </Button>
            </Box>
            <List>
              {courses?.map((course: string | CourseItem, idx) => {
                const key =
                  typeof course === "object" && course !== null
                    ? course.id
                    : String(course);
                const label =
                  typeof course === "object" && course !== null
                    ? course.title
                    : course;
                return (
                  <React.Fragment key={key}>
                    <ListItem
                      secondaryAction={
                        <>
                          <IconButton edge="end" onClick={() => {}}>
                            <EditIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText primary={label} />
                    </ListItem>
                    {idx < courses.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </>
        )}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            저장
          </Button>
        </Box>
      </Paper>

      {/* 코스 추가 다이얼로그 */}
      <CourseAddDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        allCourses={courseList}
        courses={courses || []}
        onAdd={handleAddCourse}
      />
    </Box>
  );
};

export default AdminProgramEdit;
