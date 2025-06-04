import { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import CourseBannerUploadBox from "../components/CourseBannerUploadBox";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../tools/api";

const isValidSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug);

function AdminClubSettingPage() {
  // 배너 업로드 UI 노출 상태
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    bannerUrl: "",
  });
  // 기존 배너 업로드 상태 제거

  const fetchBe = useFetchBe();

  const { club } = useParams<{ club: string }>();

  const {
    data: clubData,
    isLoading: clubLoading,
    refetch,
  } = useQuery({
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
    }
  }, [
    clubData,
    setForm,
    clubLoading,
    clubData?.name,
    clubData?.slug,
    clubData?.description,
    clubData?.bannerUrl,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  if (clubLoading) return <Typography>로딩 중...</Typography>;

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
            <Typography variant="subtitle1" mb={1}>
              배너 이미지
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
              width="100%"
            >
              {/* 이미지가 있으면 full width로 보여주고, 수정 버튼 클릭 시 업로드 UI 노출 */}
              {clubData.bannerUrl ? (
                <>
                  <Box position="relative" width="100%" maxWidth={480}>
                    <img
                      src={clubData.bannerUrl}
                      alt="배너 이미지"
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: "#eee",
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                      onClick={() => setShowBannerUpload(true)}
                    >
                      수정
                    </Button>
                  </Box>
                  {showBannerUpload && (
                    <Box mt={2}>
                      <CourseBannerUploadBox
                        targetId={clubData.id || ""}
                        targetType="club-banner"
                        onComplete={async () => {
                          setShowBannerUpload(false);
                          refetch();
                        }}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <CourseBannerUploadBox
                  targetId={clubData.id || ""}
                  targetType="club-banner"
                  onComplete={async () => {
                    refetch();
                  }}
                />
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
