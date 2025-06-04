import React, { useState } from "react";
import { Box } from "@mui/material";
import Section from "./components/Section";
import SectionCourses from "./components/SectionCourses";
import EditSectionDialog from "./EditSectionDialog";

export interface SectionListProps {
  sections: any[];
  refreshSections?: () => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  refreshSections,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);

  const handleEdit = (section: any) => {
    setSelectedSection(section);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setSelectedSection(null);
    refreshSections && refreshSections();
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
              />
              {section.nodeGroups?.map((group: any) => (
                <Box mt={1.6} key={group.id}>
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
