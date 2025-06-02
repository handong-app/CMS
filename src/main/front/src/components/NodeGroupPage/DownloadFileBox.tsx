import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  fileUrl: string;
  fileName: string;
}

const DownloadFileBox: React.FC<Props> = ({ fileUrl, fileName }) => {
  const handleDownload = () => {
    // const link = document.createElement("a");
    // link.href = fileUrl;
    // link.download = fileName || "file";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    window.open(fileUrl, "_blank"); // 또는 "_self"로 현재 탭 다운로드
  };

  return (
    <Box
      display="flex"
      justifyContent="start"
      alignItems="center"
      width="100%"
      height="100%"
      borderRadius={2}
      onClick={handleDownload}
    >
      <Box textAlign="left">
        <Typography variant="h5" ml={3}>
          {fileName}
        </Typography>
      </Box>
    </Box>
  );
};

export default DownloadFileBox;
