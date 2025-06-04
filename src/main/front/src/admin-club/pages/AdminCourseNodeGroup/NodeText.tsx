import React from "react";
import { Box, Typography } from "@mui/material";

export interface NodeTextProps {
  node: any;
}

const NodeText: React.FC<NodeTextProps> = ({ node }) => {
  return (
    <Box my={2}>
      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {node.data?.title || node.data?.text || "텍스트 노드"}
      </Typography>
      {node.data?.description && (
        <Typography variant="body2" color="text.secondary">
          {node.data.description}
        </Typography>
      )}
    </Box>
  );
};

export default NodeText;
