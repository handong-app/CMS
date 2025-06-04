import React from "react";
import { Box, Typography } from "@mui/material";
import QuizBox from "../../../components/NodeGroupPage/QuizBox";

export interface NodeQuizProps {
  node: any;
}

const NodeQuiz: React.FC<NodeQuizProps> = ({ node }) => {
  if (!node?.data?.question || !Array.isArray(node.data?.options)) {
    return <Typography color="error">퀴즈 정보 없음</Typography>;
  }
  return (
    <Box my={2}>
      <QuizBox
        question={node.data.question}
        options={node.data.options}
        answer={node.data.answer}
      />
    </Box>
  );
};

export default NodeQuiz;
