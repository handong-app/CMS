import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useFetchBe } from "../tools/api";

export interface ClubThumbnailProps {
  id: string;
  clubName: string;
  slug: string;
  description: string;
  bannerUrl?: string | null;
  isMember?: boolean;
}

const defaultBanner =
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80";

export function ClubThumbnail({
  id,
  clubName,
  slug,
  description,
  bannerUrl,
  isMember,
}: ClubThumbnailProps) {
  const fetchBe = useFetchBe();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchBe(`/v1/clubs/${slug}/join`, {
        method: "POST",
        body: { generation: 999 }, // generation은 실제 입력값으로 대체 필요
      });
      setModalOpen(true);
    } catch (e: any) {
      setError(e?.errorMsg || "가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoClub = () => {
    setModalOpen(false);
    navigate(`/club/${slug}`);
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 2,
          overflow: "hidden",
          position: "relative",
          transition: "box-shadow 0.2s",
          ":hover": { boxShadow: 6 },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="140"
            image={bannerUrl || defaultBanner}
            alt={clubName}
            sx={{ objectFit: "cover" }}
          />
          {isMember ? (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 2,
                background: "rgba(227, 242, 253, 0.86)",
                px: 1.2,
                py: 0.3,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Typography
                variant="caption"
                color="black"
                fontWeight={600}
                sx={{ lineHeight: 1.2 }}
              >
                가입됨
              </Typography>
            </Box>
          ) : null}
        </Box>
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
            {clubName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minHeight: 48, mb: 1 }}
            noWrap
          >
            {description}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            {isMember ? (
              <Button
                component={Link}
                to={`/club/${slug}`}
                size="small"
                variant="outlined"
                sx={{ ml: "auto", fontWeight: 600, borderRadius: 2 }}
              >
                바로가기
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{ ml: "auto", fontWeight: 600, borderRadius: 2 }}
                onClick={handleJoin}
                disabled={loading}
              >
                {loading ? "가입 중..." : "가입하기"}
              </Button>
            )}
          </Box>
          {error && (
            <Typography color="error" fontSize={13} mt={1}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>가입 완료</DialogTitle>
        <DialogContent>
          <Typography>
            동아리 가입이 완료되었습니다.
            <br />
            클럽 페이지로 이동하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>닫기</Button>
          <Button onClick={handleGoClub} variant="contained" color="primary">
            클럽으로 이동
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ClubThumbnail;
