import React from "react";
import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <Box
      p={2}
      //   bgcolor="#fdfdfd"
      border="1px solid #ccc"
      borderRadius={2}
      sx={{ overflow: "auto", maxHeight: "100%" }}
    >
      <ReactMarkdown
        children={content}
        components={{
          h1: ({ ...props }) => (
            <Typography variant="h4" gutterBottom {...props} />
          ),
          h2: ({ ...props }) => (
            <Typography variant="h5" gutterBottom {...props} />
          ),
          p: ({ ...props }) => (
            <Typography variant="body1" paragraph {...props} />
          ),
          li: ({ ...props }) => (
            <li>
              <Typography component="span" variant="body1" {...props} />
            </li>
          ),
        }}
      />
    </Box>
  );
};

export default MarkdownViewer;
