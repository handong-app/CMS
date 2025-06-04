import { Box, Paper, Typography } from "@mui/material";
import AdminClubMemberTable from "../components/AdminClubMemberTable";
import { ClubMember } from "../../types/clubmember.types";

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
        <AdminClubMemberTable members={data} />
      </Paper>
    </Box>
  );
}

export default AdminClubMemberListPage;
