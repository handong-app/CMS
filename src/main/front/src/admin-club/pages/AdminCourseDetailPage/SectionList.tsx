import React, { useState } from "react";
import { Box } from "@mui/material";
import Section from "./components/Section";
import SectionCourses from "./components/SectionCourses";
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

  return (
    <>
      <Box>
        {(sections ?? [])
          .sort((a, b) => a.order - b.order)
          .map((section: any) => (
            <Box key={section.id} mt={1}>
              <Section
                text={section.title}
                onEdit={() => handleEdit(section)}
                onAddPage={() => openAddNodeGroupDialog(section)}
              />
              {/* 노드 그룹 추가 모달 */}
              <Dialog open={addDialogOpen} onClose={closeAddNodeGroupDialog}>
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
              {section.nodeGroups?.map((group: any) => (
                <Box mt={1.6} key={group.id} display="flex" alignItems="center">
                  <Box
                    sx={{ flex: 1, cursor: "pointer" }}
                    onClick={() => {
                      if (club && courseSlug && group.id) {
                        navigate(
                          `/club/${club}/admin/course/${courseSlug}/node-groups/${group.id}`
                        );
                      }
                    }}
                  >
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
                    />
                  </Box>
                  <Tooltip title="노드 그룹 삭제">
                    <IconButton
                      size="small"
                      sx={{ ml: 1, color: "#e53935" }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm("정말 삭제하시겠습니까?")) return;
                        try {
                          await fetchBe(`/v1/node-group/${group.id}`, {
                            method: "DELETE",
                          });
                          if (refreshSections) await refreshSections();
                        } catch (e) {
                          alert("노드 그룹 삭제 실패: " + (e as any)?.message);
                        }
                      }}
                    >
                      <AddIcon
                        fontSize="small"
                        sx={{ transform: "rotate(45deg)" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          ))}
      </Box>
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
