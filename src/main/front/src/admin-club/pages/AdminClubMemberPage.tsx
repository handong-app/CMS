import { Box, Paper, Typography, Avatar, Stack, Grid } from "@mui/material";

export interface AdminClubMemberPageProps {
  user?: {
    userId: string;
    name: string;
    studentId: string;
    email: string;
    phone: string;
    profileImageUrl: string;
  };
}

const defaultUser = {
  userId: "u123456",
  name: "홍길동",
  studentId: "20231234",
  email: "hong@handong.edu",
  phone: "010-1234-5678",
  profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
};

function AdminClubMemberPage({ user }: AdminClubMemberPageProps) {
  const data = user ?? defaultUser;
  return (
    <Box maxWidth={480} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          회원 정보
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar
            src={data.profileImageUrl}
            alt={data.name}
            sx={{ width: 80, height: 80, fontSize: 32 }}
          />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {data.userId}
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ xs: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              학번
            </Typography>
            <Typography variant="body1">{data.studentId}</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <Typography variant="subtitle2" color="text.secondary">
              이메일
            </Typography>
            <Typography variant="body1">{data.email}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              전화번호
            </Typography>
            <Typography variant="body1">{data.phone}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default AdminClubMemberPage;
