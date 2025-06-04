import React from "react";
import { Box, Typography } from "@mui/material";
import ImagePreviewWithDownload from "../../../components/NodeGroupPage/ImagePreviewWithDownload";

export interface NodeImageProps {
  node: any;
}

const NodeImage: React.FC<NodeImageProps> = ({ node }) => {
  if (!node?.data?.file?.presignedUrl) {
    return <Typography color="error">이미지 정보 없음</Typography>;
  }
  return (
    <Box my={2}>
      <ImagePreviewWithDownload
        src={node.data.file.presignedUrl}
        filename={node.data?.file?.originalFileName || node.data?.title}
      />
      <Typography mt={1}>{node.data?.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {node.data?.description}
      </Typography>
    </Box>
  );
};

export default NodeImage;
