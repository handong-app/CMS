import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../../tools/api";
import { useParams } from "react-router";
import { Box, Typography, Paper } from "@mui/material";
import NodeRenderer from "./NodeRenderer";

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

  // nodeGroupId로 노드 그룹 상세 및 노드 목록 조회
  const { data, isLoading, error } = useQuery({
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
        <Typography variant="h6" fontWeight={600} mb={2}>
          노드 목록
        </Typography>
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
              <NodeRenderer node={node} />
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">노드가 없습니다.</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default AdminCourseNodeGroupPage;
