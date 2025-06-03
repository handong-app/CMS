import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  fileUrl: string;
  fileName: string;
}

const DownloadFileBox: React.FC<Props> = ({ fileUrl, fileName }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      display="flex"
      justifyContent="start"
      alignItems="center"
      // width="100%"
      height="100%"
      borderRadius={2}
      onClick={handleDownload}
      ml={2}
      sx={{
        padding: "5px",
        cursor: "pointer",
        "&:hover": {
          background: "#ffffff86",
        },
      }}
    >
      <Box textAlign="left" ml={2} mr={2}>
        <Typography variant="h5">{fileName}</Typography>
      </Box>
    </Box>
  );
};

export default DownloadFileBox;
