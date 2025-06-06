import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Backdrop,
  Fade,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  src: string;
  filename: string;
}

const ImagePreviewWithDownload: React.FC<Props> = ({ src, filename }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={filename}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "12px",
            objectFit: "contain",
          }}
        />

        <a
          href={src}
          target="_blank"
          download={filename || "image.jpg"}
          style={{
            display: "flex",
            alignItems: "center",
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
          onClick={(e) => e.stopPropagation()} // 다운로드 클릭 시 모달 열리지 않도록
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background =
              "#ffffffcc";
          }}
        >
          이미지 다운로드
          <FileDownloadIcon fontSize="small" sx={{ ml: 1 }} />
        </a>
      </Box>

      {/* 전체 화면 모달 */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Fade in={open}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="rgba(0,0,0,0.95)"
            position="relative"
          >
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={src}
              alt={filename}
              style={{
                // 이미지 크기대로 보고싶으면 아래처럼 max로 써야함.
                //           // maxHeight: "100%",
                //           // maxWidth: "100%",
                maxHeight: "90%",
                maxWidth: "90%",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ImagePreviewWithDownload;
