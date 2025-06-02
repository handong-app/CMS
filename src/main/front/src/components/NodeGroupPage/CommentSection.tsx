import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";

const categoryEmojiMap: Record<string, string> = {
  질문: "❓",
  피드백: "😁",
  열정: "🔥",
  감사: "☺️",
  칭찬: "🌟",
};

interface Comment {
  content: string;
  category: keyof typeof categoryEmojiMap;
  author: {
    name: string;
    uid: string;
    studentId: string;
  };
  timestamp: string; // ISO format
}

interface Props {
  comments: Comment[];
  onSubmit: (newComment: Comment) => void;
}

const CommentSection: React.FC<Props> = ({ comments, onSubmit }) => {
  const [newCategory, setNewCategory] =
    useState<keyof typeof categoryEmojiMap>("질문");
  const [newContent, setNewContent] = useState("");

  // 카테고리별 이모지 수 계산
  //   const emojiCounts: Record<string, number> = {};
  //   comments.forEach(({ category }) => {
  //     const emoji = categoryEmojiMap[category];
  //     emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
  //   });

  const categoryCounts: Record<string, number> = {};
  comments.forEach((comment) => {
    const category = comment.category.trim(); // 공백 제거!
    if (categoryEmojiMap[category]) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });
  const handleSubmit = () => {
    if (!newContent.trim()) return;
    onSubmit({
      category: newCategory,
      content: newContent,
      author: "현재유저",
    });
    setNewContent("");
  };

  return (
    <Box
      mt={2}
      bgcolor="#f0f0f0ed"
      border="1px solid #ddd"
      borderRadius={2}
      p={2}
      height="100%"
      boxShadow={1}
      overflow="auto"
      sx={
        {
          // transition: "background-color 0.5s",
          // "&:hover": { backgroundColor: "#fff" },
        }
      }
    >
      {/* 1. 이모지 카운트 표시 */}
      <Box display="flex" gap={2} mb={2} justifyContent="end">
        {Object.entries(categoryEmojiMap).map(([category, emoji]) => (
          <Box key={category} display="flex" alignItems="center" gap={0.5}>
            <Typography fontSize={20}>{emoji}</Typography>
            <Typography fontSize={14} color="gray">
              {categoryCounts[category] || 0}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 2. 댓글 입력 영역 */}
      <Box display="flex" gap={1} alignItems="center" mb={2} color="black">
        <Select
          value={newCategory}
          size="small"
          onChange={(e) =>
            setNewCategory(e.target.value as keyof typeof categoryEmojiMap)
          }
          sx={{
            color: "white",
            backgroundColor: "#23243a",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#23243a",
            },
          }}
        >
          {Object.keys(categoryEmojiMap).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        <TextField
          placeholder="댓글을 입력하세요"
          size="small"
          fullWidth
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          sx={{
            input: { color: "#23243a" },
            backgroundColor: "#f9f9f9",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#23243a",
            },
          }}
        />
        <Button
          variant="outlined"
          onClick={handleSubmit}
          sx={{
            color: "#23243a",
            borderColor: "#23243a",
            "&:hover": {
              borderColor: "#23243a",
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          등록
        </Button>
      </Box>

      {/* 3. 기존 댓글 목록 */}
      {comments.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={100}
        >
          <Typography color="gray" fontSize={14}>
            (처음으로 댓글을 남겨보세요)
          </Typography>
        </Box>
      ) : (
        comments.map((c, i) => (
          <Box key={i} mb={1}>
            <Typography color="black" fontSize={14} fontWeight={600}>
              {c.author.name} ({c.category})
            </Typography>
            <Typography color="black" fontSize={14}>
              {c.content}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default CommentSection;
