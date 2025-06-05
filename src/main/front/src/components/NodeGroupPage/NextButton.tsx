import React from "react";
import { useNavigate, useParams } from "react-router";
import { useFetchBe } from "../../tools/api";

type NextNodeGroupButtonProps = {
  currentNodeGroupId: string;
};

function NextNodeGroupButton({ currentNodeGroupId }: NextNodeGroupButtonProps) {
  const navigate = useNavigate();
  const fetchBe = useFetchBe();

  const { club, course_name } = useParams<{
    club: string;
    course_name: string;
  }>();

  const fetchNextNodeGroup = async (nodeGroupId: string) => {
    try {
      const response = await fetchBe(
        `/v1/node-group/next?nodeGroupId=${nodeGroupId}`
      );
      console.log("return: " + response);
      return response;
    } catch (error) {
      console.error("다음 노드그룹 요청 실패:", error);
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      const next = await fetchNextNodeGroup(currentNodeGroupId);
      console.log("NEXT: ", next);
      if (next?.nodeGroupId) {
        navigate(
          `/club/${club}/course/${course_name}/nodegroup/${next.nodeGroupId}`
        );
      } else {
        alert("마지막 노드 그룹입니다.");
      }
    } catch {
      alert("이동 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ padding: "8px 16px", marginTop: "20px" }}
    >
      NEXT
    </button>
  );
}

export default NextNodeGroupButton;
