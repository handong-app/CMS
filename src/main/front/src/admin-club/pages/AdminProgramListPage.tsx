import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link as RouterLink } from "react-router";
import { useNavigate, useParams } from "react-router";

export interface AdminProgramListPageProps {
  programs?: ProgramItemProps[];
}

export interface ProgramItemProps {
  id: string;
  name: string;
  description: string;
  courses: string[]; // course name list (slug/id가 있으면 id로 대체)
  participants: number;
}

const defaultPrograms: ProgramItemProps[] = [
  {
    id: "camp2025",
    name: "2025 해킹캠프",
    description: "시스템 해킹과 보안, 실습 중심의 해킹 캠프 프로그램입니다.",
    courses: ["리눅스 해킹 입문", "시스템 해킹", "네트워크 보안"],
    participants: 42,
  },
  {
    id: "webboot",
    name: "웹 개발 부트캠프",
    description: "프론트엔드와 백엔드, 실전 웹 개발을 배우는 부트캠프.",
    courses: ["React 마스터", "Node.js 실전", "UI/UX 디자인"],
    participants: 31,
  },
];

function AdminProgramListPage({ programs }: AdminProgramListPageProps) {
  const data = programs ?? defaultPrograms;
  const navigate = useNavigate();
  const { club } = useParams<{ club: string }>();

  // 삭제 핸들러 (실제 구현 시 API 연동 필요)
  const handleDelete = (programId: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      alert(`프로그램 ${programId} 삭제됨 (실제 구현 필요)`);
    }
  };

  return (
    <Box maxWidth={900} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h5" fontWeight={700}>
            동아리 프로그램 리스트
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(`/club/${club}/admin/program/add`)}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            프로그램 추가
          </Button>
        </Box>
        <List>
          {data.map((program, idx) => {
            // 실제로는 programId가 있어야 함. 여기선 name을 id로 가정
            const programId = program.name.replace(/\s/g, "");
            // 실제로는 programId, slug 등 고유값을 사용해야 함
            return (
              <Box key={program.name}>
                <ListItem
                  alignItems="flex-start"
                  disableGutters
                  sx={{ justifyContent: "space-between" }}
                  secondaryAction={
                    <Box display="flex" gap={1}>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        component={RouterLink}
                        to={`/club/${club}/program/${program.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() =>
                          navigate(
                            `/club/${club}/admin/program/edit/${programId}`
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(programId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight={600}>
                        {program.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {program.description}
                      </Typography>
                    }
                  />
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={500}
                    sx={{ minWidth: 90, textAlign: "right" }}
                  >
                    참여 인원: <b>{program.participants}</b>명
                  </Typography>
                </ListItem>
                <List
                  dense
                  disablePadding
                  sx={{ pl: 3, pb: 1 }}
                  subheader={
                    <ListSubheader
                      component="div"
                      disableSticky
                      sx={{
                        pl: 0,
                        background: "transparent",
                        color: "#888",
                        fontWeight: 500,
                      }}
                    >
                      포함 코스
                    </ListSubheader>
                  }
                >
                  {program.courses.map((course) => (
                    <ListItem key={course} sx={{ pl: 0 }}>
                      <ListItemText primary={course} />
                    </ListItem>
                  ))}
                </List>
                {idx < data.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default AdminProgramListPage;
