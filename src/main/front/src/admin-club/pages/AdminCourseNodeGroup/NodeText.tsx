import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Crepe } from "@milkdown/crepe";
import {
  Milkdown,
  MilkdownProvider,
  useEditor,
  useInstance,
} from "@milkdown/react";
import { getMarkdown } from "@milkdown/kit/utils";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord-dark.css";
import "./milkdown-overrides.css";
import { useFetchBe } from "../../../tools/api";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Node } from "../../../types/node.types";

export interface NodeTextProps {
  node: Node;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Node, Error>>;
}

const CrepeEditor: React.FC<{ defaultValue: string }> = ({ defaultValue }) => {
  const { get } = useEditor((root) => {
    return new Crepe({
      root,
      features: {
        [Crepe.Feature.ImageBlock]: false,
      },
      defaultValue,
    });
  });

  return <Milkdown />;
};

// ✅ This is the correct way - EditorControls is inside MilkdownProvider
interface EditorControlsProps {
  doSave: (content: string) => void;
  saving: boolean;
}
const EditorControls: React.FC<EditorControlsProps> = ({ doSave, saving }) => {
  const [isLoading, getInstance] = useInstance();

  const handleSave = () => {
    if (isLoading || saving) return;
    const editor = getInstance();
    if (!editor) return;
    const content = editor;
    doSave(content.action(getMarkdown()));
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isLoading || saving}
      variant="contained"
      size="small"
    >
      {saving ? "저장 중..." : "저장"}
    </Button>
  );
};

const NodeText: React.FC<NodeTextProps> = ({ node, refetch }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fetchBe = useFetchBe();

  const [title, setTitle] = useState(node.data?.title || "");

  useEffect(() => {
    setTitle(node.data?.title || "");
  }, [node.data?.title]);

  const handleSave = async (content: string) => {
    setSaving(true);
    try {
      await fetchBe(`/v1/nodes/${node.id}`, {
        method: "PATCH",
        body: {
          commentPermitted: node.commentPermitted,
          data: {
            ...node.data,
            title,
            description: content,
          },
          order: node.order,
        },
      });
      setEditing(false);
      refetch && (await refetch());
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장 중 오류 발생");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box my={2}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {editing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                fontWeight: 600,
                fontSize: 16,
                padding: 4,
                minWidth: 180,
              }}
              placeholder="제목을 입력하세요"
              disabled={saving}
            />
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {node.data?.title || "텍스트 노드"}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setEditing(true)}
              sx={{ ml: 1 }}
            >
              수정
            </Button>
          </>
        )}
      </Box>
      {editing ? (
        <Box>
          <MilkdownProvider>
            <CrepeEditor defaultValue={node.data?.description || ""} />
            <EditorControls doSave={handleSave} saving={saving} />
          </MilkdownProvider>
        </Box>
      ) : (
        <Box mb={1}>
          <ReactMarkdown>{node.data?.description || ""}</ReactMarkdown>
        </Box>
      )}
    </Box>
  );
};

export default NodeText;
