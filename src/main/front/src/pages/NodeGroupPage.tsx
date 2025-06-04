import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { nodeGroupDummy } from "../components/NodeGroupPage/NodeGroupDummy";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
// import TextSnippetIcon from "@mui/icons-material/TextSnippet"; // 텍스트용 아이콘
import CommentSection from "../components/NodeGroupPage/CommentSection";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import VideoPlayer from "../components/NodeGroupPage/VideoPlayer";
import DownloadFileBox from "../components/NodeGroupPage/DownloadFileBox";
import ImagePreviewWithDownload from "../components/NodeGroupPage/ImagePreviewWithDownload";
import QuizBox from "../components/NodeGroupPage/QuizBox";
import MultiAnswerQuizBox from "../components/NodeGroupPage/MultiAnswerQuizBox";

// 노드 타입별로 크기 매칭
const nodeHeightMap = {
  video: 600,
  file: 100,
  image: 500,
  quiz: "auto",
};
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

const iconMap = {
  VIDEO: <VideoLibraryIcon fontSize="large" />,
  FILE: <PictureAsPdfIcon fontSize="large" />,
  IMAGE: <ImageIcon fontSize="large" />,
  QUIZ: <QuizIcon fontSize="large" />,
};

function NodeGroupPage() {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);

  const toggleComments = (nodeId: string) => {
    setOpenNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <Box top={0} zIndex={1000} mb={4}>
        <Typography variant="h4" fontWeight={700} mt={6} mb={4}>
          {nodeGroupDummy.title}
        </Typography>
      </Box>

      {/* 노드 목록 */}
      <Box>
        {nodeGroupDummy.nodes.map((node, index) => {
          const emojiCountMap: Record<string, number> = {};
          node.comments.forEach((comment) => {
            // const emoji = categoryEmojiMap[comment.category];
            // if (emoji) {
            //   emojiCountMap[emoji] = (emojiCountMap[emoji] || 0) + 1;
            // }
          });

          const emojiSummary = Object.entries(emojiCountMap)
            .map(([emoji]) => `${emoji}`)
            .join(" ");

          const isOpen = openNodeId === node.id;

          return (
            // 노드의 완전 겉부분, 댓글+노드내용
            <Box display="flex" flexDirection="column" mt={2}>
              {/* 노드 번호, 제목, 댓글 부분  */}

              <Box display="flex" justifyContent="end" mt={4} mb={0}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {/* 1. 순번 */}
                  <Typography variant="h4" color="#fff" mr={2}>
                    {/* {index + 1} */}
                  </Typography>
                  {/* 노드 제목, 이름, 설명 등 */}
                  <Typography variant="h5" color="#fff">
                    {node.data.title}
                  </Typography>
                </Box>
                <Box
                  flex={4}
                  display="flex"
                  flexDirection="column"
                  alignItems="end"
                  justifyContent="space-between"
                  borderRadius={2}
                  position="relative" // 댓글"창"의 위치 기준
                >
                  {/* 댓글 버튼 */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    gap={1}
                    // pr={1}
                    px={2}
                    py={1}
                    // mt={1}
                    // mb={1}
                    // width=""
                    borderRadius={2}
                    bgcolor="rgba(255,255,255,0.8)"
                    sx={{ cursor: "pointer" }}
                    onClick={() => toggleComments(node.id)}
                  >
                    <Typography
                      sx={{ cursor: "pointer" }}
                      variant="body2"
                      fontSize={20}
                    >
                      {emojiSummary}
                    </Typography>
                    {node.comments.length === 0 ? (
                      <Typography
                        display="flex"
                        variant="body2"
                        color="gray"
                        fontSize={14}
                        sx={{ cursor: "pointer" }}
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

                  {isOpen && (
                    <Box
                      position="absolute"
                      // top={-20}
                      // left="100%" // 버튼 오른쪽에 위치
                      top={40}
                      zIndex={999}
                      width={400}
                      maxHeight={500}
                      ml={1}
                      overflow="auto"
                      boxShadow={3}
                      borderRadius={2}
                    >
                      <CommentSection
                        comments={node.comments}
                        onSubmit={() => {
                          alert("message submitted!");
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              {/* 노드 안쪽내용 (댓글 아래) */}
              <Box
                key={node.id}
                borderRadius={4}
                bgcolor={"#f0f0f010"}
                // height={nodeHeightMap[node.type.toLowerCase()] || 400}
                mt={1}
                position="relative"
                p={2}
                display="flex"
                flexDirection="row"
                gap={1}
              >
                {/* 콘텐츠 영역 */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  borderRadius={2}
                  color="black"
                  sx={{
                    flex: 5,
                    cursor: node.type === "IMAGE" ? "pointer" : "default",
                    transition: "background-color 0.2s",
                  }}
                >
                  <Box width="100%" height="100%" alignContent="center">
                    {node.type === "VIDEO" && node.data?.file?.playlist ? (
                      <VideoPlayer
                        src={`https://cms.handong.app${node.data.file.playlist}`}
                      />
                    ) : node.type === "IMAGE" &&
                      node.data?.file?.presignedUrl ? (
                      <ImagePreviewWithDownload
                        src={node.data.file.presignedUrl}
                        filename={node.data.file.originalFileName}
                      />
                    ) : (
                      <Box
                        color="white"
                        display="flex"
                        justifyContent="start"
                        flexDirection="row"
                        alignItems="center"
                      >
                        {/* {iconMap[node.type] || (
                          <DescriptionIcon fontSize="large" />
                        )} */}
                        {node.type === "QUIZ" &&
                          node.data?.question &&
                          Array.isArray(node.data.options) &&
                          typeof node.data.answer === "string" &&
                          (node.data.answer.includes("&") ? (
                            <MultiAnswerQuizBox
                              question={node.data.question}
                              options={node.data.options}
                              answer={node.data.answer}
                            />
                          ) : (
                            <QuizBox
                              question={node.data.question}
                              options={node.data.options}
                              answer={node.data.answer}
                            />
                          ))}

                        {node.type === "FILE" &&
                          node.data?.file?.presignedUrl && (
                            <DownloadFileBox
                              fileUrl={node.data.file.presignedUrl}
                              fileName={node.data.file.originalFileName}
                            />
                          )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default NodeGroupPage;
