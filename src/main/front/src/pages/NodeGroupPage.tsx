import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useParams } from "react-router";
import { useFetchBe } from "../tools/api";
import { useQuery } from "@tanstack/react-query";
import { NodeGroup } from "../types/nodeGroupData.types";
import NextNodeGroupButton from "../components/NodeGroupPage/NextButton";
import ClubRunningProgramBanner from "../components/ClubPage/ClubRunningProgramBanner";
// 노드 타입별로 크기 매칭
const nodeHeightMap: Record<string, number | string> = {
  video: 600,
  file: 100,
  image: 500,
  quiz: "auto",
  text: "auto",
};
// 이모지 매핑
const categoryEmojiMap: Record<string, string> = {
  질문: "❓",
  피드백: "😁",
  열정: "🔥",
  감사: "☺️",
  칭찬: "🌟",
};

const iconMap = {
  VIDEO: <VideoLibraryIcon fontSize="large" />,
  FILE: <AttachFileIcon fontSize="large" />,
  IMAGE: <ImageIcon fontSize="large" />,
  QUIZ: <QuizIcon fontSize="large" />,
  TEXT: <AttachFileIcon fontSize="large" />,
};

function NodeGroupPage() {
  const { nodeGroupUUID } = useParams(); // URL 파라미터에서 UUID 가져오기
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);

  const { club } = useParams<{
    club: string;
  }>();

  const toggleComments = (nodeId: string) => {
    setOpenNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const fetchBe = useFetchBe();

  const {
    data: nodeGroupData,
    isLoading,
    error,
  } = useQuery<NodeGroup>({
    queryKey: ["node-group", nodeGroupUUID],
    queryFn: () => fetchBe(`/v1/node-group/${nodeGroupUUID}`),
    enabled: !!nodeGroupUUID, // UUID 있을 때만 실행
  });

  useEffect(() => {
    if (!nodeGroupData?.id) return;
    fetchBe("/v1/progress/start", {
      method: "POST",
      body: {
        nodeGroupId: nodeGroupData?.id,
      },
    }).catch((err) => {
      console.error("Progress start error:", err);
    });
  }, [nodeGroupData?.id]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {(error as any).message}</div>;
  if (!nodeGroupData) return <div>데이터 없음</div>;

  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <ClubRunningProgramBanner club={club} sx={{ mb: 2 }} />
      <Box
        top={0}
        zIndex={1000}
        mb={4}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4" fontWeight={700} mt={6} mb={4}>
          {nodeGroupData.title}
        </Typography>
        <Box>
          <NextNodeGroupButton currentNodeGroupId={nodeGroupData.id} />
        </Box>
      </Box>

      {/* 노드 목록 */}
      <Box>
        {nodeGroupData.nodes.map((node, index) => {
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
                <Box display="flex" flexDirection="column" flex={5}>
                  <Typography variant="h5" color="#fff" mr={2}>
                    {node.data.title}
                  </Typography>
                  <Typography
                    fontSize={14}
                    color="#ffffff99"
                    mt={0.5}
                    sx={{ lineHeight: 1.4 }}
                  >
                    {node.data.description}
                  </Typography>
                </Box>

                <Box
                  flex={4}
                  display="flex"
                  flexDirection="column"
                  alignItems="end"
                  justifyContent="flex-end"
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
                height={nodeHeightMap[node.type.toLowerCase()] || 400}
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
                  color="white"
                  sx={{
                    flex: 5,
                    cursor: node.type === "IMAGE" ? "pointer" : "default",
                    transition: "background-color 0.2s",
                  }}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {/* 콘텐츠 조건 분기 */}
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
                    ) : node.type === "FILE" &&
                      node.data?.file?.presignedUrl ? (
                      <DownloadFileBox
                        fileUrl={node.data.file.presignedUrl}
                        fileName={node.data.file.originalFileName}
                      />
                    ) : node.type === "QUIZ" &&
                      node.data?.question &&
                      Array.isArray(node.data.options) &&
                      typeof node.data.answer === "string" ? (
                      node.data.answer.includes("&") ? (
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
                      )
                    ) : (
                      // 👉 콘텐츠가 없을 때 표시되는 fallback 메시지
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        width="100%"
                      >
                        <Typography
                          color="#999"
                          fontSize={18}
                          display="flex"
                          alignItems="center"
                        >
                          아직 콘텐츠가 없습니다.
                          <HourglassEmptyIcon
                            fontSize="large"
                            style={{ marginLeft: "4px" }}
                          />
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <NextNodeGroupButton currentNodeGroupId={nodeGroupData.id} />
      </Box>
    </Box>
  );
}

export default NodeGroupPage;
