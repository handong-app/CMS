import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
} from "@mui/material";

interface MultiAnswerQuizProps {
  question: string;
  options: string[];
  answer: string; // e.g., "A&B"
}

const MultiAnswerQuizBox: React.FC<MultiAnswerQuizProps> = ({
  question,
  options,
  answer,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const correctAnswers = answer.split("&").map((a) => a.trim());

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    const selectedSorted = [...selectedOptions].sort();
    const correctSorted = [...correctAnswers].sort();
    const isCorrectAnswer =
      selectedSorted.length === correctSorted.length &&
      selectedSorted.every((v, i) => v === correctSorted[i]);

    setIsCorrect(isCorrectAnswer);
    setIsAnswered(true);
  };

  const handleReset = () => {
    setSelectedOptions([]);
    setIsAnswered(false);
  };

  return (
    <Box
      p={3}
      borderRadius={2}
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
          <FormControlLabel
            sx={{
              border: "1px solid white",
              borderRadius: "5px",
              transition: "background-color 0.2s",
              "&:hover": { backgroundColor: "#ffffff11" },
            }}
            key={option}
            control={
              <Checkbox
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
                disabled={isAnswered}
              />
            }
            label={option}
          />
        ))}
      </Box>

      {!isAnswered ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0}
          sx={{ mt: 2 }}
        >
          답 확인
        </Button>
      ) : (
        <>
          <Typography
            mt={2}
            color={isCorrect ? "green" : "red"}
            fontWeight="bold"
          >
            {isCorrect ? "맞았습니다!" : "틀렸습니다!"}
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1 }}>
            다시 풀기
          </Button>
        </>
      )}
    </Box>
  );
};

export default MultiAnswerQuizBox;
