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
  if (!node?.data?.file || editing) {
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

  // 상태별 분기 처리
  const status = node.data.file.status;
  const progress = node.data.file.progress;

  if (status === "TRANSCODING") {
    return (
      <Box my={2}>
        <Typography color="primary" fontWeight={600} mb={1}>
          비디오 트랜스코딩 중...
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Box width={120}>
            <Box
              sx={{
                height: 8,
                background: "#eee",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${progress || 0}%`,
                  height: "100%",
                  background: "#1976d2",
                  transition: "width 0.3s",
                }}
              />
            </Box>
          </Box>
          <Typography fontSize={14} color="text.secondary">
            {progress != null ? `${progress}%` : "진행률 계산 중..."}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mt={1}>
          트랜스코딩이 완료되면 영상이 표시됩니다.
        </Typography>
        <Button sx={{ mt: 2 }} size="small" variant="outlined" disabled>
          비디오 변경 (트랜스코딩 중)
        </Button>
      </Box>
    );
  }

  if (status !== "TRANSCODE_COMPLETED") {
    // 실패, 업로드 중, 대기 등 기타 상태
    let message = "";
    switch (status) {
      case "PENDING":
        message = "비디오 업로드 대기 중입니다.";
        break;
      case "UPLOADING":
        message = "비디오 업로드 중입니다.";
        break;
      case "UPLOADED":
        message =
          "비디오 업로드가 완료되었습니다. 트랜스코딩을 기다리는 중입니다.";
        break;
      case "TRANSCODE_FAILED":
        message = "비디오 트랜스코딩에 실패했습니다. 다시 업로드해 주세요.";
        break;
      default:
        message = `비디오 상태: ${status}`;
    }
    return (
      <Box my={2}>
        <Typography
          color={status === "TRANSCODE_FAILED" ? "error" : "primary"}
          fontWeight={600}
          mb={1}
        >
          {message}
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
