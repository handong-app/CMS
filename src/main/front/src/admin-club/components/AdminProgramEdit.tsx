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
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import AdminClubMemberTable, { ClubMember } from "./AdminClubMemberTable";

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
  enrolledMembers?: ClubMember[]; // 수강중인 회원 목록
}

const AdminProgramEdit: React.FC<AdminProgramEditProps> = ({
  allCourses,
  initialName = "",
  initialDescription = "",
  initialCourses = [],
  onSave,
  enrolledMembers,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [courses, setCourses] = useState<string[]>(initialCourses);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [members, setMembers] = useState<ClubMember[]>(enrolledMembers ?? []);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<ClubMember>>({});

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

  // 회원 추가
  const handleAddMember = () => {
    if (
      newMember.userId &&
      newMember.name &&
      newMember.studentId &&
      newMember.email &&
      newMember.phone &&
      newMember.profileImageUrl
    ) {
      setMembers((prev) => [...prev, newMember as ClubMember]);
      setNewMember({});
      setMemberDialogOpen(false);
    }
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
          sx={{ mb: 1 }}
        />
        <Box my={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              수강중인 회원 목록
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => setMemberDialogOpen(true)}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              회원 추가
            </Button>
          </Box>
          <AdminClubMemberTable members={members} />
        </Box>
        {/* 회원 추가 다이얼로그 */}
        <Dialog
          open={memberDialogOpen}
          onClose={() => setMemberDialogOpen(false)}
        >
          <DialogTitle>회원 추가</DialogTitle>
          <DialogContent sx={{ minWidth: 340 }}>
            <TextField
              label="이름"
              value={newMember.name ?? ""}
              onChange={(e) =>
                setNewMember((m) => ({ ...m, name: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="학번"
              value={newMember.studentId ?? ""}
              onChange={(e) =>
                setNewMember((m) => ({ ...m, studentId: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="이메일"
              value={newMember.email ?? ""}
              onChange={(e) =>
                setNewMember((m) => ({ ...m, email: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="전화번호"
              value={newMember.phone ?? ""}
              onChange={(e) =>
                setNewMember((m) => ({ ...m, phone: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="프로필 이미지 URL"
              value={newMember.profileImageUrl ?? ""}
              onChange={(e) =>
                setNewMember((m) => ({ ...m, profileImageUrl: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="유저 ID"
              value={newMember.userId ?? ""}
              onChange={(e) =>
                setNewMember((m) => ({ ...m, userId: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMemberDialogOpen(false)}>취소</Button>
            <Button
              onClick={handleAddMember}
              variant="contained"
              disabled={
                !newMember.userId ||
                !newMember.name ||
                !newMember.studentId ||
                !newMember.email ||
                !newMember.phone ||
                !newMember.profileImageUrl
              }
            >
              추가
            </Button>
          </DialogActions>
        </Dialog>
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
          {courses.map((course: any, idx) => (
            <React.Fragment key={course.id || course.title || course}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setEditIdx(idx);
                        setEditValue(course.title || course);
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
                <ListItemText primary={course.title || course} />
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
