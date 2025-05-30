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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export interface AdminProgramEditProps {
  allCourses: string[]; // 전체 코스 목록 (id/slug로 대체 가능)
  initialName?: string;
  initialDescription?: string;
  initialCourses?: string[];
  onSave?: (data: {
    name: string;
    description: string;
    courses: string[];
  }) => void;
}

const AdminProgramEdit: React.FC<AdminProgramEditProps> = ({
  allCourses,
  initialName = "",
  initialDescription = "",
  initialCourses = [],
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [courses, setCourses] = useState<string[]>(initialCourses);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // 코스 추가
  const handleAddCourse = (course: string) => {
    if (!courses.includes(course)) setCourses([...courses, course]);
    setAddDialogOpen(false);
  };

  // 코스 수정
  const handleEditCourse = (idx: number, newValue: string) => {
    setCourses((prev) => prev.map((c, i) => (i === idx ? newValue : c)));
    setEditIdx(null);
    setEditValue("");
  };

  // 코스 삭제
  const handleDeleteCourse = (idx: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== idx));
  };

  // 저장
  const handleSave = () => {
    onSave?.({ name, description, courses });
  };

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
          label="프로그램 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mb: 3 }}
        />
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
          {courses.map((course, idx) => (
            <React.Fragment key={course}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setEditIdx(idx);
                        setEditValue(course);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteCourse(idx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={course} />
              </ListItem>
              {idx < courses.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
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
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>코스 추가</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={allCourses.filter((c) => !courses.includes(c))}
            renderInput={(params) => (
              <TextField {...params} label="코스 선택" />
            )}
            onChange={(_, value) => value && handleAddCourse(value)}
            autoHighlight
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>

      {/* 코스 수정 다이얼로그 */}
      <Dialog open={editIdx !== null} onClose={() => setEditIdx(null)}>
        <DialogTitle>코스 수정</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={allCourses.filter(
              (c) => !courses.includes(c) || c === editValue
            )}
            value={editValue}
            renderInput={(params) => (
              <TextField {...params} label="코스 선택" />
            )}
            onChange={(_, value) => value && setEditValue(value)}
            autoHighlight
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIdx(null)}>취소</Button>
          <Button
            onClick={() =>
              editIdx !== null && handleEditCourse(editIdx, editValue)
            }
            disabled={!editValue}
            variant="contained"
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProgramEdit;
