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
import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../tools/api";

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

function AdminProgramListPage() {
  const navigate = useNavigate();
  const fetchBe = useFetchBe();
  const { club } = useParams<{ club: string }>();

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ["clubPrograms", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs`),
  });

  // 삭제 핸들러 (실제 구현 시 API 연동 필요)
  const handleDelete = (programId: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      alert(`프로그램 ${programId} 삭제됨 (실제 구현 필요)`);
    }
  };

  if (programsLoading) return <Typography>로딩 중...</Typography>;

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
          {Array.isArray(programs) &&
            programs.map((program, idx) => {
              const programId = program.id;
              return (
                <Box key={program.id}>
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
                              `/club/${club}/admin/program/edit/${program.slug}`
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
                    {/* participants 필드는 더미 데이터에만 있을 수 있으므로 안전하게 처리 */}
                    {typeof program.participants !== "undefined" && (
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{ minWidth: 90, textAlign: "right" }}
                      >
                        참여 인원: <b>{program.participants}</b>명
                      </Typography>
                    )}
                  </ListItem>
                  {/* courses가 배열일 때만 코스 리스트 렌더 */}
                  {Array.isArray(program.courses) &&
                    program.courses.length > 0 && (
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
                        {/* 코스가 객체 배열일 경우 title, 문자열 배열일 경우 그대로 출력 */}
                        {program.courses.map((course: any) => (
                          <ListItem
                            key={
                              typeof course === "string"
                                ? course
                                : course.id || course.title
                            }
                            sx={{ pl: 0 }}
                          >
                            <ListItemText
                              primary={
                                typeof course === "string"
                                  ? course
                                  : course.title
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  {idx < programs.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              );
            })}
        </List>
      </Paper>
    </Box>
  );
}

export default AdminProgramListPage;
