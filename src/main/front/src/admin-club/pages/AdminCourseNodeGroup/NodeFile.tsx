import React from "react";
import { Box, Typography } from "@mui/material";
import DownloadFileBox from "../../../components/NodeGroupPage/DownloadFileBox";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface NodeFileProps {
  node: any;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

const NodeFile: React.FC<NodeFileProps> = ({ node }) => {
  if (!node?.data?.file?.presignedUrl) {
    return <Typography color="error">파일 정보 없음</Typography>;
  }
  return (
    <Box my={2}>
      <DownloadFileBox
        fileUrl={node.data.file.presignedUrl}
        fileName={node.data?.file?.originalFileName || node.data?.title}
      />
      <Typography mt={1}>{node.data?.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {node.data?.description}
      </Typography>
    </Box>
  );
};

export default NodeFile;
