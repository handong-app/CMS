import { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export interface AdminClubSettingPageProps {
  slug?: string;
  description?: string;
  bannerUrl?: string;
}

const defaultClub = {
  slug: "ai-club",
  description: "A student-run club focused on AI projects.",
  bannerUrl: "https://example.com/images/ai-club-banner.jpg",
};

function AdminClubSettingPage({
  slug,
  description,
  bannerUrl,
}: AdminClubSettingPageProps) {
  const [form, setForm] = useState({
    slug: slug ?? defaultClub.slug,
    description: description ?? defaultClub.description,
    bannerUrl: bannerUrl ?? defaultClub.bannerUrl,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(form.bannerUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBannerPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 파일 업로드 및 저장 로직 추가
    alert(
      "저장되었습니다!\n" +
        JSON.stringify(
          {
            ...form,
            bannerFile: bannerFile ? bannerFile.name : undefined,
          },
          null,
          2
        )
    );
  };

  return (
    <Box maxWidth={480} mx="auto" mt={6}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          동아리 설정
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="슬러그"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="설명"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Box mt={2} mb={2} textAlign="center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleBannerChange}
            />
            <Typography variant="subtitle1" mb={1}>
              배너 이미지
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Avatar
                variant="rounded"
                src={bannerPreview}
                alt="배너 미리보기"
                sx={{
                  width: 320,
                  height: 80,
                  borderRadius: 2,
                  border: "1px solid #ccc",
                  bgcolor: "#eee",
                }}
              >
                {!bannerPreview && "No Image"}
              </Avatar>
              <IconButton
                color="primary"
                component="span"
                onClick={handleBannerClick}
                sx={{ mt: 1 }}
              >
                <PhotoCamera />
                <Typography variant="body2" ml={1}>
                  이미지 업로드
                </Typography>
              </IconButton>
              {bannerFile && (
                <Typography variant="caption" color="text.secondary">
                  {bannerFile.name}
                </Typography>
              )}
            </Box>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              px: 5,
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
            }}
            fullWidth
          >
            저장
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminClubSettingPage;
