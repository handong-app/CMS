import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { nodeGroupDummy } from "../components/NodeGroupPage/NodeGroupDummy";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import TextSnippetIcon from "@mui/icons-material/TextSnippet"; // 텍스트용 아이콘
import CommentSection from "../components/NodeGroupPage/CommentSection";
import { Link, useLocation } from "react-router"; //
import AddIcon from "@mui/icons-material/Add"; // 추가
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// 이모지 매핑
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
  video: <VideoLibraryIcon fontSize="large" />,
  pdf: <PictureAsPdfIcon fontSize="large" />,
  image: <ImageIcon fontSize="large" />,
  text: <TextSnippetIcon fontSize="large" />,
};

const emotionIcons: Record<string, string> = {
  피드백: "😁",
  축하: "🎉",
  열정: "🔥",
  감사: "☺️",
  칭찬: "🌟",
};

function NodeGroupPage() {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);
  const location = useLocation();
  const basePath = location.pathname;

  const toggleComments = (nodeId: string) => {
    setOpenNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <Box top={0} zIndex={1000} mb={4}>
        <Typography variant="h5" fontWeight={700} mt={6} mb={6}>
          {nodeGroupDummy.nodeGroupName}
        </Typography>
      </Box>

      {/* 노드 목록 */}
      <Box>
        {nodeGroupDummy.nodes.map((node, index) => {
          const emojiCountMap: Record<string, number> = {};
          node.comments.forEach((comment) => {
            const emoji = categoryEmojiMap[comment.category];
            if (emoji) {
              emojiCountMap[emoji] = (emojiCountMap[emoji] || 0) + 1;
            }
          });

          const emojiSummary = Object.entries(emojiCountMap)
            .map(([emoji]) => `${emoji}`)
            .join(" ");

          const isOpen = openNodeId === node.nodeId;

          return (
            <Box
              key={node.nodeId}
              borderRadius={4}
              bgcolor={"#f0f0f010"}
              height={350}
              mt={4}
              position="relative"
              p={2}
              display="flex"
              flexDirection="row"
              gap={1}
            >
              {/* 아이콘 영역 */}
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius={2}
                p={2}
              >
                {/* 1. 순번 */}
                <Typography variant="h4" color="#fff" mb={1}>
                  {index + 1}
                </Typography>

                {/* 2. nodeId */}
                <Typography
                  variant="caption"
                  color="white"
                  mb={1}
                  fontSize={14}
                >
                  {node.nodeId}
                </Typography>

                {/* 3. 아이콘 */}
                {/* <Box>
                  {iconMap[node.type] || <DescriptionIcon fontSize="large" />}
                </Box> */}
              </Box>

              {/* 콘텐츠 영역 */}
              <Link
                to={`${basePath}/node/${node.nodeId}`}
                style={{ textDecoration: "none", flex: 5 }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  bgcolor="#fafafa34"
                  borderRadius={2}
                  color="black"
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": { backgroundColor: "#f0f0f09a" },
                  }}
                >
                  <Box color="white">
                    {iconMap[node.type] || <DescriptionIcon fontSize="large" />}
                  </Box>
                </Box>
              </Link>

              {/* 이모지 + 댓글 */}
              <Box
                flex={4}
                display="flex"
                flexDirection="column"
                alignItems="end"
                justifyContent="space-between"
                borderRadius={2}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap={1}
                  pl={1}
                  // pr={1}
                  px={2}
                  py={1}
                  // width=""
                  borderRadius={2}
                  bgcolor="rgba(255,255,255,0.8)"
                  sx={{ cursor: "pointer" }}
                  onClick={() => toggleComments(node.nodeId)}
                >
                  <Typography variant="body2" fontSize={20}>
                    {emojiSummary}
                  </Typography>

                  {/* {node.comments.length === 0 ? (
                    <AddIcon fontSize="small" sx={{ color: "gray" }} />
                  ) : (
                    // 또는 <ChatBubbleOutlineIcon fontSize="small" sx={{ color: "gray" }} />
                    <Typography fontSize={14} color="black">
                      {node.comments.length}
                    </Typography>
                  )} */}
                  {node.comments.length === 0 ? (
                    <Typography
                      display="flex"
                      variant="body2"
                      color="gray"
                      fontSize={14}
                    >
                      댓글을 추가해보세요!
                      <ChatBubbleOutlineIcon
                        fontSize="small"
                        sx={{ color: "gray", marginLeft: "10px" }}
                      />{" "}
                    </Typography>
                  ) : (
                    <Typography fontSize={14} color="black">
                      {node.comments.length}{" "}
                    </Typography>
                  )}
                </Box>

                {!isOpen && (
                  <Box display="flex">노드 설명, 작성자 등등 정보..</Box>
                )}
                {isOpen && (
                  <CommentSection
                    comments={node.comments}
                    onSubmit={() => {
                      alert("message submitted!");
                    }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default NodeGroupPage;
