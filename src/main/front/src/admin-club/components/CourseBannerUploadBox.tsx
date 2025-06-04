import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useFetchBe } from "../../tools/api";

export interface CourseBannerUploadBoxProps {
  targetId: string;
  targetType: "club-banner" | "course-banner";
  onComplete?: (url: string) => void;
}

const CourseBannerUploadBox: React.FC<CourseBannerUploadBoxProps> = ({
  targetId,
  targetType,
  onComplete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchBe = useFetchBe();

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(null);
    try {
      // 1. presigned url 요청
      const params = new URLSearchParams({ id: targetId, filename: file.name });
      const res = await fetchBe(
        `/v1/s3/upload-url/${targetType}?${params.toString()}`,
        {
          method: "POST",
        }
      );
      // 2. S3 presigned url로 파일 업로드
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", res.presignedUrl);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () =>
          xhr.status === 200 ? resolve() : reject("S3 업로드 실패");
        xhr.onerror = () => reject("S3 업로드 실패");
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream"
        );
        xhr.send(file);
      });
      // 3. 업로드 완료 알림
      await fetchBe("/v1/s3/upload-complete", {
        method: "POST",
        body: {
          id: targetId,
          fileListId: res.fileListId,
          fileKey: res.fileKey,
        },
      });
      setProgress(100);
      // presigned 응답에 url이 있으면 전달, 없으면 fileKey로 url 생성 필요
      if (onComplete) {
        // fileKey가 S3 경로라면, 실제 서비스에 맞는 URL로 변환 필요
        // 여기서는 fileKey를 그대로 전달
        onComplete(res.url || res.presignedUrl?.split("?")[0] || "");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드 중 오류 발생");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      p={2}
      border={"1px dashed #aaa"}
      borderRadius={2}
      textAlign="center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{ cursor: uploading ? "not-allowed" : "pointer" }}
    >
      <Typography mb={1}>배너 이미지를 업로드하세요.</Typography>
      <Typography mb={1} color="text.secondary" fontSize={14}>
        이미지를 이 영역에 드래그하거나, 아래 버튼으로 선택하세요.
      </Typography>
      <Button variant="contained" component="label" disabled={uploading}>
        {uploading ? "업로드 중..." : "이미지 선택"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleInputChange}
          disabled={uploading}
        />
      </Button>
      {progress !== null && (
        <Typography mt={1} color="primary.main">
          업로드 진행: {progress}%
        </Typography>
      )}
      {error && (
        <Typography mt={1} color="error.main">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CourseBannerUploadBox;
