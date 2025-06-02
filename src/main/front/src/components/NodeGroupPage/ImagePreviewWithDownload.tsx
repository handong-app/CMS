import React from "react";
import { Box } from "@mui/material";

interface Props {
  src: string;
  filename: string;
}

const ImagePreviewWithDownload: React.FC<Props> = ({ src, filename }) => {
  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <img
        src={src}
        alt={filename}
        style={{
          // 이미지 크기대로 보고싶으면 아래처럼 max로 써야함.
          // maxHeight: "100%",
          // maxWidth: "100%",
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          objectFit: "cover",
        }}
      />
      <a
        href={src}
        target="_blank"
        // rel="noopener noreferrer"
        download={filename || "image.jpg"}
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          padding: "6px 12px",
          background: "#ffffffcc",
          color: "#333",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          zIndex: 10,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#ddd";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#ffffffcc";
        }}
      >
        이미지 다운로드
      </a>
    </Box>
  );
};

export default ImagePreviewWithDownload;
