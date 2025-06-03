import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

interface QuizBoxProps {
  question: string;
  options: string[];
  answer: string;
}

const QuizBox: React.FC<QuizBoxProps> = ({ question, options, answer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsAnswered(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const isCorrect = selectedOption === answer;

  return (
    <Box
      p={3}
      //   borderRadius={2}
      //   boxShadow={3}
      minWidth="90%"
      margin="auto"
      textAlign="center"
    >
      <Typography variant="h6" mb={2}>
        {question}
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        {options.map((option) => (
          <Button
            key={option}
            // variant="contained"
            sx={{
              color: "white",
              border: "1px solid white",
              borderRadius: "5px",
              transition: "background-color 0.2s",
              "&:hover": { backgroundColor: "#ffffff11" },
            }}
            color={
              isAnswered && option === answer
                ? "success"
                : isAnswered && option === selectedOption
                ? "error"
                : "primary"
            }
            onClick={() => handleSelect(option)}
            disabled={isAnswered}
          >
            {option}
          </Button>
        ))}
      </Box>

      {isAnswered && (
        <>
          <Typography
            mt={2}
            color={isCorrect ? "green" : "red"}
            fontWeight="bold"
          >
            {isCorrect ? "맞았습니다!" : "틀렸습니다!"}
          </Typography>

          <Button
            onClick={handleReset}
            variant="text"
            sx={{ mt: 1, color: "#666", textDecoration: "underline" }}
          >
            다시 풀기
          </Button>
        </>
      )}
    </Box>
  );
};

export default QuizBox;
