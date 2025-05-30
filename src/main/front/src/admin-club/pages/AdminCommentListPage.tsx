import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface AdminCommentItem {
  id: string;
  author: string;
  authorProfileUrl?: string;
  course: string;
  node: string;
  date: string;
  category: string;
  content: string;
}

export interface AdminCommentListPageProps {
  comments?: AdminCommentItem[];
}

const defaultComments: AdminCommentItem[] = [
  {
    id: "c1",
    author: "홍길동",
    authorProfileUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    course: "리눅스 해킹 입문",
    node: "리눅스 설치하기",
    date: "2024-06-01 14:23",
    category: "질문",
    content: "설치 과정에서 오류가 발생합니다. 어떻게 해야 하나요?",
  },
  {
    id: "c2",
    author: "김영희",
    authorProfileUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    course: "시스템 해킹",
    node: "심화 실습",
    date: "2024-06-01 13:10",
    category: "피드백",
    content: "실습 자료가 더 있었으면 좋겠어요.",
  },
  {
    id: "c3",
    author: "이철수",
    authorProfileUrl: "https://randomuser.me/api/portraits/men/65.jpg",
    course: "네트워크 보안",
    node: "네트워크 패킷 분석",
    date: "2024-05-31 19:45",
    category: "일반",
    content: "강의가 이해하기 쉬웠습니다!",
  },
  {
    id: "c4",
    author: "최은영",
    authorProfileUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    course: "리눅스 해킹 입문",
    node: "기초 명령어 배우기",
    date: "2024-05-30 09:12",
    category: "질문",
    content: "명령어 중에 잘 이해가 안 되는 부분이 있어요.",
  },
  {
    id: "c5",
    author: "박지훈",
    authorProfileUrl: "https://randomuser.me/api/portraits/men/77.jpg",
    course: "시스템 해킹",
    node: "설치 퀴즈",
    date: "2024-05-29 17:30",
    category: "피드백",
    content: "퀴즈 난이도가 적당했습니다.",
  },
  {
    id: "c6",
    author: "서노력",
    authorProfileUrl: "https://randomuser.me/api/portraits/men/88.jpg",
    course: "네트워크 보안",
    node: "방화벽 우회",
    date: "2024-05-28 11:05",
    category: "일반",
    content: "방화벽 우회 강의가 흥미로웠어요.",
  },
  {
    id: "c7",
    author: "문새벽",
    authorProfileUrl: "https://randomuser.me/api/portraits/women/99.jpg",
    course: "리눅스 해킹 입문",
    node: "리눅스 취약점 분석",
    date: "2024-05-27 15:40",
    category: "질문",
    content: "취약점 분석에 대해 더 설명해주실 수 있나요?",
  },
  {
    id: "c8",
    author: "정다정",
    authorProfileUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    course: "시스템 해킹",
    node: "명령어 정리 자료",
    date: "2024-05-26 10:20",
    category: "일반",
    content: "자료가 잘 정리되어 있어요!",
  },
];

const PAGE_SIZE = 5;

const AdminCommentListPage: React.FC<AdminCommentListPageProps> = ({
  comments,
}) => {
  const [data, setData] = useState<AdminCommentItem[]>(
    comments ?? defaultComments
  );
  const [page, setPage] = useState(1);

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setData((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const paged = data.slice(0, page * PAGE_SIZE);
  const hasMore = data.length > paged.length;

  return (
    <Box maxWidth={1100} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          댓글 관리
        </Typography>
        <TableContainer sx={{ background: "transparent", boxShadow: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>작성자</TableCell>
                <TableCell>작성된 코스</TableCell>
                <TableCell>작성된 노드</TableCell>
                <TableCell>날짜</TableCell>
                <TableCell>댓글 카테고리</TableCell>
                <TableCell>댓글 내용</TableCell>
                <TableCell align="center">삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((comment) => (
                <TableRow key={comment.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={comment.authorProfileUrl}
                        alt={comment.author}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography variant="body2">{comment.author}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{comment.course}</TableCell>
                  <TableCell>{comment.node}</TableCell>
                  <TableCell>{comment.date}</TableCell>
                  <TableCell>{comment.category}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {comment.content}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {hasMore && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="outlined"
              onClick={() => setPage((p) => p + 1)}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              더 불러오기
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminCommentListPage;
