import React from "react";
import { Box, Typography } from "@mui/material";
import VideoPlayer from "../../../components/NodeGroupPage/VideoPlayer";

export interface NodeVideoProps {
  node: any;
}

const NodeVideo: React.FC<NodeVideoProps> = ({ node }) => {
  if (!node?.data?.file?.playlist) {
    return <Typography color="error">비디오 정보 없음</Typography>;
  }
  return (
    <Box my={2}>
      <VideoPlayer src={node.data.file.playlist} />
      <Typography mt={1}>{node.data?.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {node.data?.description}
      </Typography>
    </Box>
  );
};

export default NodeVideo;
