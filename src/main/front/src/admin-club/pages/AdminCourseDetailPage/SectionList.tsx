import React, { useState } from "react";
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
import { Box } from "@mui/material";
import Section from "./components/Section";
import SectionCourses from "./components/SectionCourses";
import SectionSortableItem from "./components/SectionSortableItem";
import NodeGroupSortableItem from "./components/NodeGroupSortableItem";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useFetchBe } from "../../../tools/api";
import { useNavigate, useParams } from "react-router";
import EditSectionDialog from "./EditSectionDialog";

export interface SectionListProps {
  sections: any[];
  refreshSections?: () => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  refreshSections,
}) => {
  // 드래그 상태 관리용
  const [localSections, setLocalSections] = useState<any[]>(sections ?? []);
  // 서버 데이터와 동기화
  React.useEffect(() => {
    setLocalSections(sections ?? []);
  }, [sections]);
  const navigate = useNavigate();
  const { club, courseSlug } = useParams<{
    club: string;
    courseSlug: string;
  }>();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const fetchBe = useFetchBe();

  // node_group 추가 모달 상태
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addTargetSection, setAddTargetSection] = useState<any | null>(null);
  const [addForm, setAddForm] = useState({
    title: "",
    order: 1,
  });

  // 모달 열기
  const openAddNodeGroupDialog = (section: any) => {
    setAddTargetSection(section);
    setAddForm({
      title: "",
      order: (section.nodeGroups?.length ?? 0) + 1,
    });
    setAddDialogOpen(true);
  };

  // 모달 닫기
  const closeAddNodeGroupDialog = () => {
    setAddDialogOpen(false);
    setAddTargetSection(null);
    setAddForm({ title: "", order: 1 });
  };

  // 인풋 핸들러
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleEdit = (section: any) => {
    setSelectedSection(section);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setSelectedSection(null);
    refreshSections && refreshSections();
  };

  // node_group(페이지 그룹) 추가 핸들러 (모달에서 호출)
  const handleAddNodeGroup = async () => {
    if (!addTargetSection) return;
    const sectionId = addTargetSection.id;
    const payload = {
      sectionId,
      title: addForm.title,
      order: addForm.order,
    };
    try {
      await fetchBe(`/v1/node-group`, {
        method: "POST",
        body: payload,
      });
      closeAddNodeGroupDialog();
      if (refreshSections) await refreshSections();
    } catch (e) {
      alert("노드 그룹 추가 실패: " + (e as any)?.message);
    }
  };

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 섹션 순서 업데이트 함수 (fromIdx, toIdx 지원)
  const updateSectionOrder = (
    sections: any[],
    fromIdx?: number,
    toIdx?: number
  ) => {
    let newSections = sections;
    if (typeof fromIdx === "number" && typeof toIdx === "number") {
      newSections = arrayMove(sections, fromIdx, toIdx).map((section, idx) => ({
        ...section,
        order: idx + 1,
      }));
    }
    setLocalSections(newSections);
    newSections.forEach((section) => {
      console.log("section", section.id, section.order);
      fetchBe(`/v1/clubs/_/courses/_/sections/${section.id}`, {
        method: "PATCH",
        body: {
          order: section.order,
        },
      });
    });
  };

  // 노드 그룹 순서 업데이트 함수 (특정 섹션 내, fromIdx, toIdx 지원)
  const updateNodeGroupOrder = (
    sectionIdx: number,
    nodeGroups: any[],
    fromIdx?: number,
    toIdx?: number
  ) => {
    let newNodeGroups = nodeGroups;
    if (typeof fromIdx === "number" && typeof toIdx === "number") {
      newNodeGroups = arrayMove(nodeGroups, fromIdx, toIdx).map(
        (g: any, idx: number) => ({
          ...g,
          order: idx + 1,
        })
      );
    }
    const newSections = localSections.map((s, idx) =>
      idx === sectionIdx ? { ...s, nodeGroups: newNodeGroups } : s
    );
    setLocalSections(newSections);
    newNodeGroups.forEach((g: any) => {
      console.log("nodeGroup", g.id, g.order);
      fetchBe(`/v1/node-group/${g.id}`, {
        method: "PATCH",
        body: {
          order: g.order,
        },
      });
    });
  };

  // 섹션 드래그 종료 핸들러
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localSections.findIndex((s) => s.id === active.id);
    const newIndex = localSections.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      updateSectionOrder(localSections, oldIndex, newIndex);
    }
  };

  // 노드 그룹 드래그 종료 핸들러 (세션 간 이동 포함)
  const handleNodeGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // active.id: nodeGroupId, over.id: nodeGroupId
    let fromSectionIdx = -1,
      fromGroupIdx = -1,
      toSectionIdx = -1,
      toGroupIdx = -1;
    localSections.forEach((section, sIdx) => {
      const gIdx = section.nodeGroups?.findIndex(
        (g: any) => g.id === active.id
      );
      if (gIdx !== -1 && gIdx !== undefined) {
        fromSectionIdx = sIdx;
        fromGroupIdx = gIdx;
      }
      const toGIdx = section.nodeGroups?.findIndex(
        (g: any) => g.id === over.id
      );
      if (toGIdx !== -1 && toGIdx !== undefined) {
        toSectionIdx = sIdx;
        toGroupIdx = toGIdx;
      }
    });
    // 같은 섹션 내에서만 이동 허용
    if (
      fromSectionIdx === -1 ||
      fromGroupIdx === -1 ||
      toSectionIdx === -1 ||
      fromSectionIdx !== toSectionIdx
    ) {
      return;
    }
    updateNodeGroupOrder(
      fromSectionIdx,
      localSections[fromSectionIdx].nodeGroups,
      fromGroupIdx,
      toGroupIdx
    );
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={localSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box>
            {localSections.map((section: any, sectionIdx: number) => (
              <SectionSortableItem key={section.id} id={section.id}>
                <Box mt={1}>
                  <Section
                    text={section.title}
                    onEdit={() => handleEdit(section)}
                    onAddPage={() => openAddNodeGroupDialog(section)}
                    onMoveUp={
                      sectionIdx > 0
                        ? () =>
                            updateSectionOrder(
                              localSections,
                              sectionIdx,
                              sectionIdx - 1
                            )
                        : undefined
                    }
                    onMoveDown={
                      sectionIdx < localSections.length - 1
                        ? () =>
                            updateSectionOrder(
                              localSections,
                              sectionIdx,
                              sectionIdx + 1
                            )
                        : undefined
                    }
                    disableMoveUp={sectionIdx === 0}
                    disableMoveDown={sectionIdx === localSections.length - 1}
                  />
                  {/* 노드 그룹 추가 모달 */}
                  <Dialog
                    open={addDialogOpen}
                    onClose={closeAddNodeGroupDialog}
                  >
                    <DialogTitle>노드 그룹(페이지 그룹) 추가</DialogTitle>
                    <DialogContent sx={{ minWidth: 340 }}>
                      <TextField
                        label="노드 그룹명"
                        name="title"
                        value={addForm.title}
                        onChange={handleAddFormChange}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="순서 (숫자)"
                        name="order"
                        type="number"
                        value={addForm.order}
                        onChange={handleAddFormChange}
                        fullWidth
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={closeAddNodeGroupDialog}>취소</Button>
                      <Button
                        variant="contained"
                        onClick={handleAddNodeGroup}
                        disabled={!addForm.title || !addForm.order}
                      >
                        추가
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {/* 노드 그룹 DnD */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleNodeGroupDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={section.nodeGroups?.map((g: any) => g.id) || []}
                      strategy={verticalListSortingStrategy}
                    >
                      {section.nodeGroups?.map(
                        (group: any, groupIdx: number) => (
                          <NodeGroupSortableItem key={group.id} id={group.id}>
                            <Box mt={1.6} display="flex" alignItems="center">
                              <Box sx={{ flex: 1 }}>
                                <SectionCourses
                                  title={group.title}
                                  description={section.description}
                                  nodes={
                                    Array.isArray(group.nodes)
                                      ? group.nodes.map((node: any) => {
                                          let title = "";
                                          switch (node.type) {
                                            case "VIDEO":
                                            case "IMAGE":
                                            case "FILE":
                                            case "TEXT":
                                              title = node.data?.title ?? "";
                                              break;
                                            case "QUIZ":
                                              title = node.data?.question ?? "";
                                              break;
                                            default:
                                              title = "";
                                          }
                                          return {
                                            id: node.id,
                                            type:
                                              node.type === "FILE"
                                                ? "doc"
                                                : (node.type.toLowerCase() as
                                                    | "video"
                                                    | "image"
                                                    | "quiz"
                                                    | "doc"
                                                    | "file"
                                                    | "text"),
                                            title,
                                          };
                                        })
                                      : []
                                  }
                                  onMove={() => {
                                    if (club && courseSlug && group.id) {
                                      navigate(
                                        `/club/${club}/admin/course/${courseSlug}/node-groups/${group.id}`
                                      );
                                    }
                                  }}
                                  onDelete={async () => {
                                    if (
                                      !window.confirm("정말 삭제하시겠습니까?")
                                    )
                                      return;
                                    try {
                                      await fetchBe(
                                        `/v1/node-group/${group.id}`,
                                        {
                                          method: "DELETE",
                                        }
                                      );
                                      if (refreshSections)
                                        await refreshSections();
                                    } catch (e) {
                                      alert(
                                        "노드 그룹 삭제 실패: " +
                                          (e as any)?.message
                                      );
                                    }
                                  }}
                                  onMoveUp={
                                    groupIdx > 0
                                      ? () =>
                                          updateNodeGroupOrder(
                                            sectionIdx,
                                            section.nodeGroups,
                                            groupIdx,
                                            groupIdx - 1
                                          )
                                      : undefined
                                  }
                                  onMoveDown={
                                    groupIdx < section.nodeGroups.length - 1
                                      ? () =>
                                          updateNodeGroupOrder(
                                            sectionIdx,
                                            section.nodeGroups,
                                            groupIdx,
                                            groupIdx + 1
                                          )
                                      : undefined
                                  }
                                  disableMoveUp={groupIdx === 0}
                                  disableMoveDown={
                                    groupIdx === section.nodeGroups.length - 1
                                  }
                                />
                              </Box>
                            </Box>
                          </NodeGroupSortableItem>
                        )
                      )}
                    </SortableContext>
                  </DndContext>
                </Box>
              </SectionSortableItem>
            ))}
          </Box>
        </SortableContext>
      </DndContext>
      <EditSectionDialog
        open={editOpen}
        section={
          selectedSection || {
            id: "",
            title: "",
            description: "",
            order: 1,
            nodeGroups: [],
          }
        }
        onClose={handleClose}
        onSave={handleClose}
      />
    </>
  );
};

export default SectionList;
