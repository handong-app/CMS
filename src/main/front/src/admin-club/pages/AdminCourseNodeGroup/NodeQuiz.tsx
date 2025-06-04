import React from "react";
import { Box, Typography } from "@mui/material";
import QuizBox from "../../../components/NodeGroupPage/QuizBox";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useFetchBe } from "../../../tools/api";
import { Node } from "../../../types/node.types";

export interface NodeQuizProps {
  node: Node;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

const NodeQuiz: React.FC<NodeQuizProps> = ({ node, refetch }) => {
  const [editing, setEditing] = React.useState(false);
  const [question, setQuestion] = React.useState(node.data?.question || "");
  const [options, setOptions] = React.useState<string[]>(
    node.data?.options || [""]
  );
  const [answer, setAnswer] = React.useState<number>(
    typeof node.data?.answer === "number" ? node.data.answer : 0
  );
  const [saving, setSaving] = React.useState(false);
  const fetchBe = useFetchBe();

  React.useEffect(() => {
    setQuestion(node.data?.question || "");
    setOptions(node.data?.options || [""]);
    setAnswer(typeof node.data?.answer === "number" ? node.data.answer : 0);
  }, [node.data]);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === idx ? value : opt)));
  };
  const handleAddOption = () => setOptions((prev) => [...prev, ""]);
  const handleRemoveOption = (idx: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchBe(`/v1/nodes/${node.id}`, {
        method: "PATCH",
        body: {
          commentPermitted: node.commentPermitted,
          data: {
            ...node.data,
            question,
            options,
            answer,
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

  if (!node?.data?.question || !Array.isArray(node.data?.options)) {
    return <Typography color="error">퀴즈 정보 없음</Typography>;
  }

  if (editing) {
    return (
      <Box my={2}>
        <Typography fontWeight={600} mb={1}>
          퀴즈 수정
        </Typography>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="문제 입력"
          style={{ width: "100%", marginBottom: 8, fontSize: 16, padding: 4 }}
          disabled={saving}
        />
        {options.map((opt, idx) => (
          <Box key={idx} display="flex" alignItems="center" mb={1}>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`선택지 ${idx + 1}`}
              style={{ flex: 1, fontSize: 15, padding: 4 }}
              disabled={saving}
            />
            <input
              type="radio"
              name="answer"
              checked={answer === idx}
              onChange={() => setAnswer(idx)}
              style={{ marginLeft: 8 }}
              disabled={saving}
            />
            <Typography
              variant="body2"
              sx={{ ml: 0.5, mr: 1 }}
              color="text.secondary"
            >
              정답
            </Typography>
            {options.length > 1 && (
              <button
                onClick={() => handleRemoveOption(idx)}
                disabled={saving}
                style={{ marginLeft: 4 }}
              >
                삭제
              </button>
            )}
          </Box>
        ))}
        <button
          onClick={handleAddOption}
          disabled={saving}
          style={{ marginBottom: 8 }}
        >
          선택지 추가
        </button>
        <Box mt={2}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginRight: 8 }}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button onClick={() => setEditing(false)} disabled={saving}>
            취소
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <Box my={2}>
      <QuizBox
        question={node.data.question}
        options={node.data.options}
        answer={node.data.answer}
      />
      <Box mt={2}>
        <button onClick={() => setEditing(true)}>수정</button>
      </Box>
    </Box>
  );
};

export default NodeQuiz;
