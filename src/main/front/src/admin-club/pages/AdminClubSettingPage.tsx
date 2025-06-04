import { useState, useRef, useEffect } from "react";
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
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../tools/api";

const isValidSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug);

function AdminClubSettingPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    bannerUrl: "",
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(form.bannerUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBe = useFetchBe();

  const { club } = useParams<{ club: string }>();

  const { data: clubData, isLoading: clubLoading } = useQuery({
    queryKey: ["clubData", club],
    queryFn: () => fetchBe(`/v1/clubs/${club}`),
    enabled: !!club,
  });

  useEffect(() => {
    if (clubData) {
      setForm((prev) => {
        // if prev data is empty, use clubData
        return {
          name: prev.name || clubData.clubName || "",
          slug: prev.slug || clubData.slug || "",
          description: prev.description || clubData.description || "",
          bannerUrl: prev.bannerUrl || clubData.bannerUrl || "",
        };
      });
      setBannerPreview(clubData.bannerUrl || "");
    }
  }, [
    clubData,
    setForm,
    setBannerPreview,
    clubLoading,
    clubData?.name,
    clubData?.slug,
    clubData?.description,
    clubData?.bannerUrl,
  ]);

  console.log("clubData", clubData);

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

  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 동아리 정보 PATCH (이미지 제외)
      await fetchBe(`/v1/clubs/${club}`, {
        method: "PATCH",
        body: {
          name: form.name,
          // slug: form.slug,
          description: form.description,
          // bannerUrl: form.bannerUrl, // 이미지는 나중에
        },
      });
      alert("저장되었습니다!");
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장 중 오류 발생");
    } finally {
      setSaving(false);
    }
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
            label="이름"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="슬러그"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!isValidSlug(form.slug)}
            disabled
            helperText={
              !isValidSlug(form.slug)
                ? "소문자, 숫자, 하이픈만 사용 가능합니다"
                : ""
            }
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
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminClubSettingPage;
