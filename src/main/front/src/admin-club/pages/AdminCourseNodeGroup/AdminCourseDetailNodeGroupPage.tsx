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
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import NodeSortableItem from "./NodeSortableItem";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditIcon from "@mui/icons-material/Edit";

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
      refetch && (await refetch());
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "노드 추가 실패");
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

  // 노드 그룹 제목 수정 상태
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(data?.title || "");
  const [savingTitle, setSavingTitle] = useState(false);

  useEffect(() => {
    setTitle(data?.title || "");
  }, [data?.title]);

  const handleTitleSave = async () => {
    setSavingTitle(true);
    try {
      await fetchBe(`/v1/node-group/${nodeGroupId}`, {
        method: "PATCH",
        body: { title, order: data.order },
      });
      setEditingTitle(false);
      refetch && (await refetch());
    } catch (e) {
      alert(e instanceof Error ? e.message : "제목 저장 실패");
    } finally {
      setSavingTitle(false);
    }
  };

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 노드 순서 상태 (로컬)
  const [localNodes, setLocalNodes] = useState<any[]>([]);
  useEffect(() => {
    if (Array.isArray(data?.nodes)) {
      setLocalNodes(
        data.nodes
          .slice()
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      );
    }
  }, [data?.nodes]);

  // 드래그 종료 핸들러
  const handleNodeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localNodes.findIndex((n) => n.id === active.id);
    const newIndex = localNodes.findIndex((n) => n.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newNodes = arrayMove(localNodes, oldIndex, newIndex).map(
        (node, idx) => ({
          ...node,
          order: idx + 1,
        })
      );
      setLocalNodes(newNodes);
      newNodes.forEach((node) => {
        console.log("node", node.id, node.order);
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>노드 그룹 정보를 불러올 수 없습니다.</div>;
  if (!data) return <div>노드 그룹 정보 없음</div>;

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Box display="flex" alignItems="center" mb={2}>
        {editingTitle ? (
          <>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              sx={{ mr: 1 }}
              autoFocus
              disabled={savingTitle}
            />
            <Button
              onClick={handleTitleSave}
              disabled={savingTitle}
              variant="contained"
              size="small"
            >
              저장
            </Button>
            <Button
              onClick={() => setEditingTitle(false)}
              disabled={savingTitle}
              size="small"
              sx={{ ml: 1 }}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" fontWeight={700} mr={2}>
              노드 그룹: {data.title}
            </Typography>
            <Button
              onClick={() => setEditingTitle(true)}
              size="small"
              variant="outlined"
            >
              제목 수정
            </Button>
          </>
        )}
      </Box>
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
        {Array.isArray(localNodes) && localNodes.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleNodeDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={localNodes.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              {localNodes.map((node: any, idx: number) => (
                <NodeSortableItem key={node.id} id={node.id}>
                  <Box
                    mb={2}
                    p={2}
                    borderRadius={2}
                    bgcolor="rgba(255,255,255,0.1)"
                    display="flex"
                    alignItems="center"
                  >
                    <Box flex={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight={600} mb={1}>
                          {idx + 1}.{" "}
                          {node.data?.title || node.data?.question || node.type}
                        </Typography>
                        <Box display="flex" alignItems="center" ml={2} gap={1}>
                          <Button
                            size="small"
                            sx={{ minWidth: 32, color: "#fff" }}
                            onClick={
                              idx > 0
                                ? () => {
                                    const newNodes = arrayMove(
                                      localNodes,
                                      idx,
                                      idx - 1
                                    ).map((n, i) => ({ ...n, order: i + 1 }));
                                    setLocalNodes(newNodes);
                                    newNodes.forEach((n) =>
                                      console.log("node", n.id, n.order)
                                    );
                                  }
                                : undefined
                            }
                            disabled={idx === 0}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </Button>
                          <Button
                            size="small"
                            sx={{ minWidth: 32, color: "#fff" }}
                            onClick={
                              idx < localNodes.length - 1
                                ? () => {
                                    const newNodes = arrayMove(
                                      localNodes,
                                      idx,
                                      idx + 1
                                    ).map((n, i) => ({ ...n, order: i + 1 }));
                                    setLocalNodes(newNodes);
                                    newNodes.forEach((n) =>
                                      console.log("node", n.id, n.order)
                                    );
                                  }
                                : undefined
                            }
                            disabled={idx === localNodes.length - 1}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </Button>
                          <Box mt={1}>
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#fff", cursor: "grab" }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      <NodeRenderer node={node} refetch={refetch} />
                    </Box>
                  </Box>
                </NodeSortableItem>
              ))}
            </SortableContext>
          </DndContext>
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
