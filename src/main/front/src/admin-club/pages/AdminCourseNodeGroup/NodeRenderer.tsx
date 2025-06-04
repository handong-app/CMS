import React from "react";

import NodeVideo from "./NodeVideo";
import NodeImage from "./NodeImage";
import NodeFile from "./NodeFile";
import NodeQuiz from "./NodeQuiz";
import NodeText from "./NodeText";
import { Typography } from "@mui/material";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface NodeRendererProps {
  node: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

const NodeRenderer: React.FC<NodeRendererProps> = ({ node, refetch }) => {
  if (!node) return null;
  switch (node.type) {
    case "VIDEO":
      return <NodeVideo node={node} refetch={refetch} />;
    case "IMAGE":
      return <NodeImage node={node} refetch={refetch} />;
    case "FILE":
      return <NodeFile node={node} refetch={refetch} />;
    case "QUIZ":
      return <NodeQuiz node={node} refetch={refetch} />;
    case "TEXT":
      return <NodeText node={node} refetch={refetch} />;
    default:
      return <Typography color="error">알 수 없는 노드 타입</Typography>;
  }
};

export default NodeRenderer;
