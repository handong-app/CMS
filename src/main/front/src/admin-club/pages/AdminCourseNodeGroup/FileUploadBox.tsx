import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useState } from "react";
import { useFetchBe } from "../../../tools/api";
import { Box, Button, Typography } from "@mui/material";

// 파일 업로드용 임시 컴포넌트
interface FileUploadBoxProps {
  node: any;
  onComplete?: () => void;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({ node, onComplete }) => {
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
      const res = await fetchBe("/v1/s3/upload-url/node-file", {
        method: "POST",
        body: { filename: file.name, nodeId: node.id },
      });
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
      const completeRes = await fetchBe("/v1/s3/upload-complete/node-file", {
        method: "POST",
        body: {
          id: node.id,
          fileListId: res.fileListId,
          fileKey: res.fileKey,
        },
      });
      setProgress(100);
      onComplete && (await onComplete());
    } catch (e: any) {
      setError(e?.message || "업로드 중 오류 발생");
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
      sx={{
        cursor: uploading ? "not-allowed" : "pointer",
        // background: uploading ? "#f5f5f5" : undefined,
      }}
    >
      <Typography mb={1}>파일이 없습니다. 파일을 업로드하세요.</Typography>
      <Typography mb={1} color="text.secondary" fontSize={14}>
        파일을 이 영역에 드래그하거나, 아래 버튼으로 선택하세요.
      </Typography>
      <Button variant="contained" component="label" disabled={uploading}>
        {uploading ? "업로드 중..." : "파일 선택"}
        <input
          type="file"
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

export default FileUploadBox;
