import React from "react";
import { Box, Typography, Button } from "@mui/material";
import VideoPlayer from "../../../components/NodeGroupPage/VideoPlayer";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Node } from "../../../types/node.types";
import FileUploadBox from "./FileUploadBox";

export interface NodeVideoProps {
  node: Node;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Node, Error>>;
}

const NodeVideo: React.FC<NodeVideoProps> = ({ node, refetch }) => {
  const [editing, setEditing] = React.useState(false);

  // 파일이 없거나, 수정 버튼을 누르면 업로드 UI 노출
  if (!node?.data?.file?.playlist || editing) {
    return (
      <Box my={2}>
        <FileUploadBox
          node={node}
          onComplete={() => {
            refetch && refetch();
            setEditing(false);
          }}
        />
        {!!node?.data?.file?.playlist && (
          <Button
            sx={{ mt: 2 }}
            size="small"
            variant="outlined"
            onClick={() => setEditing(false)}
          >
            취소
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box my={2}>
      <VideoPlayer src={node.data.file.playlist} />
      <Typography mt={1}>{node.data?.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {node.data?.description}
      </Typography>
      <Button
        sx={{ mt: 2 }}
        size="small"
        variant="outlined"
        onClick={() => setEditing(true)}
      >
        비디오 변경
      </Button>
    </Box>
  );
};

export default NodeVideo;
