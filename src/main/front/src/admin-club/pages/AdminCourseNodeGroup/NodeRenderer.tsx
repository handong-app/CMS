import React from "react";

import NodeVideo from "./NodeVideo";
import NodeImage from "./NodeImage";
import NodeFile from "./NodeFile";
import NodeQuiz from "./NodeQuiz";
import NodeText from "./NodeText";
import { Typography } from "@mui/material";

export interface NodeRendererProps {
  node: any;
}

const NodeRenderer: React.FC<NodeRendererProps> = ({ node }) => {
  if (!node) return null;
  switch (node.type) {
    case "VIDEO":
      return <NodeVideo node={node} />;
    case "IMAGE":
      return <NodeImage node={node} />;
    case "FILE":
      return <NodeFile node={node} />;
    case "QUIZ":
      return <NodeQuiz node={node} />;
    case "TEXT":
      return <NodeText node={node} />;
    default:
      return <Typography color="error">알 수 없는 노드 타입</Typography>;
  }
};

export default NodeRenderer;
