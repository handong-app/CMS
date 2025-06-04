import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFetchBe } from "../tools/api";

export interface UserProfileImageUploadBoxProps {
  userId: string;
  photoURL?: string;
  size?: number;
  onUploaded?: (url: string) => void;
}

const UserProfileImageUploadBox: React.FC<UserProfileImageUploadBoxProps> = ({
  userId,
  photoURL,
  size = 80,
  onUploaded,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchBe = useFetchBe();

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(null);
    try {
      // 1. presigned url 요청
      const params = new URLSearchParams({ id: userId, filename: file.name });
      const res = await fetchBe(
        `/v1/s3/upload-url/user-profile?${params.toString()}`,
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
          id: userId,
          fileListId: res.fileListId,
          fileKey: res.fileKey,
        },
      });
      setProgress(100);
      const url = res.url || res.presignedUrl?.split("?")[0] || "";
      if (onUploaded) onUploaded(url);
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

  const handleClick = () => {
    if (!uploading) inputRef.current?.click();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ cursor: uploading ? "not-allowed" : "pointer" }}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      mb={1}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleInputChange}
        disabled={uploading}
      />
      <Avatar
        src={photoURL || "https://lh3.googleusercontent.com/a/default-user"}
        alt="프로필 이미지"
        sx={{
          width: size,
          height: size,
          mb: 1,
          border: "2px solid #7AB8FF",
          bgcolor: "#222",
        }}
      >
        {!photoURL && "No Image"}
      </Avatar>
      {uploading && (
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <CircularProgress size={18} color="primary" />
          <Typography color="primary" fontSize={14}>
            업로드 중... {progress !== null ? `${progress}%` : ""}
          </Typography>
        </Box>
      )}
      {error && (
        <Typography color="error" fontSize={13} mt={1}>
          {error}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary">
        클릭 또는 드래그로 이미지 업로드
      </Typography>
    </Box>
  );
};

export default UserProfileImageUploadBox;
