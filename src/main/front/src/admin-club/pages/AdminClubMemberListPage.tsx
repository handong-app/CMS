import {
  Box,
  Paper,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router";

export interface ClubMember {
  userId: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  profileImageUrl: string;
}

export interface AdminClubMemberListPageProps {
  members?: ClubMember[];
}

const defaultMembers: ClubMember[] = [
  {
    userId: "u123456",
    name: "홍길동",
    studentId: "20231234",
    email: "hong@handong.edu",
    phone: "010-1234-5678",
    profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    userId: "u234567",
    name: "김영희",
    studentId: "20231235",
    email: "kim@handong.edu",
    phone: "010-2345-6789",
    profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    userId: "u345678",
    name: "이철수",
    studentId: "20231236",
    email: "lee@handong.edu",
    phone: "010-3456-7890",
    profileImageUrl: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

function AdminClubMemberListPage({ members }: AdminClubMemberListPageProps) {
  const data = members ?? defaultMembers;
  return (
    <Box maxWidth={800} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          전체 회원 목록
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>프로필</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>학번</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>전화번호</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((member) => (
                <TableRow
                  key={member.userId}
                  hover
                  sx={{ cursor: "pointer", textDecoration: "none" }}
                  component={Link}
                  to={`./${member.userId}`}
                >
                  <TableCell>
                    <Avatar src={member.profileImageUrl} alt={member.name} />
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.studentId}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default AdminClubMemberListPage;
