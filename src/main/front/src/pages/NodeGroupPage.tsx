import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { nodeGroupDummy } from "../components/NodeGroupPage/NodeGroupDummy";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import QuizIcon from "@mui/icons-material/Quiz";
import ImageIcon from "@mui/icons-material/Image";
import CommentSection from "../components/NodeGroupPage/CommentSection";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// 이모지 매핑
const categoryEmojiMap: Record<string, string> = {
  질문: "❓",
  여담: "💬",
  정보: "💡",
  응원: "👏",
  기타: "📌",
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

export interface NodeGroupProps {
  title: string;
  description: string;
  nodes: Node[];
}
export interface Node {
  id: string;
  type: "text" | "video" | "doc" | "quiz" | "image";
  title: string;
}
const iconMap = {
  text: <DescriptionIcon fontSize="inherit" />,
  video: <VideoLibraryIcon fontSize="inherit" />,
  doc: <DescriptionIcon fontSize="inherit" />,
  quiz: <QuizIcon fontSize="inherit" />,
  image: <ImageIcon fontSize="inherit" />,
};

const emotionIcons: Record<string, string> = {
  피드백: "😁",
  축하: "🎉",
  열정: "🔥",
  감사: "☺️",
  칭찬: "🌟",
};

function NodeGroupPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleComments = () => {
    setIsOpen((prev) => !prev);
  };
  const emojiCountMap: Record<string, number> = {};
  comments.forEach((comment) => {
    const emoji = categoryEmojiMap[comment.category];
    if (emoji) {
      emojiCountMap[emoji] = (emojiCountMap[emoji] || 0) + 1;
    }
  });

  // 이모지들을 표시 순으로 나열
  const emojiSummary = Object.entries(emojiCountMap)
    .map(([emoji]) => `${emoji}`)
    .join(" ");

  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <Box
        // position="sticky"
        top={0}
        zIndex={1000}
        mb={4}
      >
        <Typography variant="h5" fontWeight={700} mt={6} mb={6}>
          {nodeGroupDummy.nodeGroupName}
        </Typography>
      </Box>
      {/* 노드 공간 */}

      <Box>
        <Box
          borderRadius={4}
          bgcolor={"#f0f0f010"}
          height={350}
          mt={4}
          position="relative"
          p={2}
          display="flex"
          flexDirection="row"
          // alignItems="stretch"
          gap={1}
        >
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="#fff"
            borderRadius={2}
          >
            <Typography variant="body2">video</Typography>
            <VideoLibraryIcon fontSize="large" />
          </Box>
          <Box
            flex={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#fafafa"
            borderRadius={2}
          >
            <Typography variant="body1">콘텐츠 내용 영역</Typography>
          </Box>
          {/*  이모지 + 댓글 */}

          <Box
            flex={2}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            // bgcolor="#fff"
            borderRadius={2}
            // p={2}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={1}
              px={2}
              py={1}
              borderRadius={2}
              bgcolor="rgba(255,255,255,0.8)"
              sx={{ cursor: "pointer" }}
              onClick={toggleComments}
            >
              <Typography fontSize={20}>{emojiSummary}</Typography>
              <Typography fontSize={14} color="black">
                {comments.length}
              </Typography>
            </Box>

            {/* 댓글창: 클릭 시 아래 렌더링 */}
            {isOpen && (
              <CommentSection
                // comments={node.comments}
                // onSubmit={(newComment) => {
                //   setNodeComments((prev) => [...prev, newComment]);
                // }}
                comments={comments}
                onSubmit={() => {
                  alert("message submitted!");
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default NodeGroupPage;

const comments = [
  {
    content: "이 부분 다시 설명해주시면 좋겠어요.",
    category: "질문",
    author: {
      name: "김지원",
      uid: "user123",
      studentId: "20230001",
    },
    timestamp: "2025-05-31T09:15:00Z",
  },
  {
    content: "재밌는 사례네요 ㅋㅋ",
    category: "여담",
    author: {
      name: "박준형",
      uid: "user456",
      studentId: "20220111",
    },
    timestamp: "2025-05-31T09:17:30Z",
  },
  {
    content: "AI 모델 학습 구조 참고 링크 공유드립니다.",
    category: "정보",
    author: {
      name: "이지은",
      uid: "user789",
      studentId: "20221234",
    },
    timestamp: "2025-05-31T09:22:10Z",
  },
  {
    content: "다들 고생 많으셨어요 👏",
    category: "응원",
    author: {
      name: "최성민",
      uid: "user321",
      studentId: "20210456",
    },
    timestamp: "2025-05-31T09:30:45Z",
  },
  {
    content: "오늘 점심 뭐 먹을까요?",
    category: "기타",
    author: {
      name: "한서윤",
      uid: "user654",
      studentId: "20210123",
    },
    timestamp: "2025-05-31T09:33:10Z",
  },
];
