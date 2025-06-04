import React from "react";

import NodeVideo from "./NodeVideo";
import NodeImage from "./NodeImage";
import NodeFile from "./NodeFile";
import NodeQuiz from "./NodeQuiz";
import NodeText from "./NodeText";
import { Typography, Button, Box } from "@mui/material";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface NodeRendererProps {
  node: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

import { useFetchBe } from "../../../tools/api";

const NodeRenderer: React.FC<NodeRendererProps> = ({ node, refetch }) => {
  const fetchBe = useFetchBe();
  if (!node) return null;

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 노드를 삭제하시겠습니까?")) return;
    try {
      await fetchBe(`/v1/nodes/${node.id}`, { method: "DELETE" });
      refetch && (await refetch());
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 중 오류 발생");
    }
  };

  let nodeComponent: React.ReactNode = null;
  switch (node.type) {
    case "VIDEO":
      nodeComponent = <NodeVideo node={node} refetch={refetch} />;
      break;
    case "IMAGE":
      nodeComponent = <NodeImage node={node} refetch={refetch} />;
      break;
    case "FILE":
      nodeComponent = <NodeFile node={node} refetch={refetch} />;
      break;
    case "QUIZ":
      nodeComponent = <NodeQuiz node={node} refetch={refetch} />;
      break;
    case "TEXT":
      nodeComponent = <NodeText node={node} refetch={refetch} />;
      break;
    default:
      nodeComponent = (
        <Typography color="error">알 수 없는 노드 타입</Typography>
      );
  }

  return (
    <Box position="relative" mb={2}>
      <Box position="absolute" top={0} right={0} zIndex={2}>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={handleDelete}
        >
          삭제
        </Button>
      </Box>
      {nodeComponent}
    </Box>
  );
};

export default NodeRenderer;
