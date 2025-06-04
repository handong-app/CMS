import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../../tools/api";
import { useParams } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import NodeRenderer from "./NodeRenderer";
import React, { useState } from "react";

const NODE_TYPES = [
  { value: "TEXT", label: "텍스트" },
  { value: "QUIZ", label: "퀴즈" },
  { value: "IMAGE", label: "이미지(파일)" },
  { value: "FILE", label: "파일" },
  { value: "VIDEO", label: "비디오" },
];

function getDefaultData(type: string) {
  switch (type) {
    case "TEXT":
      return { title: "", text: "", description: "" };
    case "QUIZ":
      return { question: "", options: ["", ""], answer: "" };
    case "IMAGE":
    case "FILE":
      return { title: "", description: "" };
    case "VIDEO":
      return { title: "", description: "" };
    default:
      return {};
  }
}
function AdminCourseNodeGroupPage() {
  const {
    club: clubId,
    courseSlug,
    nodeGroupId,
  } = useParams<{
    club: string;
    courseSlug: string;
    nodeGroupId: string;
  }>();
  const fetchBe = useFetchBe();

  // 노드 추가 다이얼로그 상태
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState("TEXT");
  const [addData, setAddData] = useState(getDefaultData("TEXT"));
  const [addCommentPermitted, setAddCommentPermitted] = useState(true);
  const [addError, setAddError] = useState<string | null>(null);

  // 노드 추가 다이얼로그 열기
  const handleOpenAdd = () => {
    setAddType("TEXT");
    setAddData(getDefaultData("TEXT"));
    setAddCommentPermitted(true);
    setAddError(null);
    setAddOpen(true);
  };
  const handleCloseAdd = () => setAddOpen(false);

  // 입력값 변경 핸들러
  const handleTypeChange = (e: any) => {
    setAddType(e.target.value);
    setAddData(getDefaultData(e.target.value));
  };
  const handleDataChange = (e: any) => {
    const { name, value } = e.target;
    setAddData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleQuizOptionChange = (idx: number, value: string) => {
    setAddData((prev: any) => {
      const options = [...(prev.options || [])];
      options[idx] = value;
      return { ...prev, options };
    });
  };
  const handleAddQuizOption = () => {
    setAddData((prev: any) => ({
      ...prev,
      options: [...(prev.options || []), ""],
    }));
  };
  const handleRemoveQuizOption = (idx: number) => {
    setAddData((prev: any) => {
      const options = [...(prev.options || [])];
      options.splice(idx, 1);
      return { ...prev, options };
    });
  };

  // 노드 생성 요청
  const handleAddNode = async () => {
    setAddError(null);
    if (!nodeGroupId || !data) return;
    // 필수값 검증
    if (addType === "QUIZ") {
      if (!addData.question || !(addData.options?.length > 1)) {
        setAddError("퀴즈 문제와 선택지는 2개 이상 필요합니다.");
        return;
      }
    } else if (addType === "TEXT") {
      if (!addData.title && !addData.text) {
        setAddError("제목 또는 텍스트를 입력하세요.");
        return;
      }
    } else {
      if (!addData.title) {
        setAddError("제목을 입력하세요.");
        return;
      }
    }
    // order: 마지막+1
    const order = Array.isArray(data.nodes) ? data.nodes.length + 1 : 1;
    // API 경로: /api/v1/courses/{courseId}/sections/{sectionId}/node-groups/{nodeGroupId}/nodes
    try {
      await fetchBe(`/v1/nodes`, {
        method: "POST",
        body: {
          nodeGroupId,
          type: addType,
          commentPermitted: addCommentPermitted,
          data: addData,
          order,
        },
      });
      setAddOpen(false);
      // 강제 리프레시
      window.location.reload();
    } catch (e: any) {
      setAddError(e?.message || "노드 추가 실패");
    }
  };

  // nodeGroupId로 노드 그룹 상세 및 노드 목록 조회
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["nodeGroupDetail", nodeGroupId],
    queryFn: async () => {
      if (!nodeGroupId) return null;
      // /v1/node-group/{nodeGroupId}에서 nodes 포함 전체 정보 반환
      const res = await fetchBe(`/v1/node-group/${nodeGroupId}`);
      // string일 수도 있으니 파싱
      if (typeof res === "string") return JSON.parse(res);
      return res;
    },
    enabled: !!nodeGroupId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>노드 그룹 정보를 불러올 수 없습니다.</div>;
  if (!data) return <div>노드 그룹 정보 없음</div>;

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        노드 그룹: {data.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        ID: {data.id}
      </Typography>
      <Paper
        sx={{ p: 3, borderRadius: 2, background: "rgba(255,255,255,0.04)" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            노드 목록
          </Typography>
          <Button variant="contained" size="small" onClick={handleOpenAdd}>
            노드 추가
          </Button>
        </Box>
        {Array.isArray(data.nodes) && data.nodes.length > 0 ? (
          data.nodes.map((node: any, idx: number) => (
            <Box
              key={node.id}
              mb={2}
              p={2}
              borderRadius={2}
              bgcolor="rgba(255,255,255,0.1)"
            >
              <Typography fontWeight={600} mb={1}>
                {idx + 1}.{" "}
                {node.data?.title || node.data?.question || node.type}
              </Typography>
              <NodeRenderer node={node} refetch={refetch} />
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">노드가 없습니다.</Typography>
        )}
      </Paper>

      {/* 노드 추가 다이얼로그 */}
      <Dialog open={addOpen} onClose={handleCloseAdd} maxWidth="xs" fullWidth>
        <DialogTitle>노드 추가</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>노드 타입</InputLabel>
            <Select
              value={addType}
              label="노드 타입"
              onChange={handleTypeChange}
            >
              {NODE_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* 타입별 입력 폼 */}
          {addType === "TEXT" && (
            <>
              <TextField
                label="제목"
                name="title"
                value={addData.title || ""}
                onChange={handleDataChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="설명"
                name="description"
                value={addData.description || ""}
                onChange={handleDataChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {addType === "QUIZ" && (
            <>
              <TextField
                label="문제"
                name="question"
                value={addData.question || ""}
                onChange={handleDataChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              {(addData.options || []).map((opt: string, idx: number) => (
                <Box
                  key={idx}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1}
                >
                  <TextField
                    label={`선택지 ${idx + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleQuizOptionChange(idx, e.target.value)
                    }
                    fullWidth
                  />
                  {Array.isArray(addData.options) &&
                    addData.options.length > 2 && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveQuizOption(idx)}
                      >
                        -
                      </Button>
                    )}
                </Box>
              ))}
              <Button size="small" onClick={handleAddQuizOption} sx={{ mb: 2 }}>
                + 선택지 추가
              </Button>
              <TextField
                label="정답"
                name="answer"
                value={addData.answer || ""}
                onChange={handleDataChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {(addType === "IMAGE" ||
            addType === "FILE" ||
            addType === "VIDEO") && (
            <>
              <TextField
                label="제목"
                name="title"
                value={addData.title || ""}
                onChange={handleDataChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="설명"
                name="description"
                value={addData.description || ""}
                onChange={handleDataChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* 파일 업로드는 추후 지원 */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block" }}
              >
                파일 업로드는 노드 생성 후 수정에서 가능합니다.
              </Typography>
            </>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={addCommentPermitted}
                onChange={(e) => setAddCommentPermitted(e.target.checked)}
              />
            }
            label="댓글 허용"
            sx={{ mb: 1 }}
          />
          {addError && (
            <Typography color="error" fontSize={14}>
              {addError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>취소</Button>
          <Button onClick={handleAddNode} variant="contained">
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminCourseNodeGroupPage;
