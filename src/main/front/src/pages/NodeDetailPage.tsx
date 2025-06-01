import React from "react";
import { useParams } from "react-router";
import { Box, Typography } from "@mui/material";

// 테스트용 더미 데이터(나중에 수정)
const dummyNodeData = {
  id: "abc123",
  type: "video",
  title: "노드 상세 제목",
  content: "이곳은 노드의 상세 콘텐츠를 보여주는 영역입니다.",
};

const NodeDetailPage = () => {
  const { nodeId } = useParams<{ nodeId: string }>();

  return (
    <Box maxWidth={960} mx="auto" mt={6} p={4}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        노드 ID: {nodeId}
      </Typography>

      <Typography variant="h5" gutterBottom>
        {dummyNodeData.title}
      </Typography>

      <Box
        bgcolor="#f9f9f9"
        p={3}
        borderRadius={2}
        border="1px solid #ddd"
        mt={2}
      >
        <Typography variant="body1">{dummyNodeData.content}</Typography>
      </Box>
    </Box>
  );
};

export default NodeDetailPage;
