import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFetchBe } from "../../tools/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

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
  const [openModal, setOpenModal] = useState(false);

  const fetchNextNodeGroup = async (nodeGroupId: string) => {
    try {
      const response = await fetchBe(
        `/v1/node-group/next?nodeGroupId=${nodeGroupId}`
      );
      return response;
    } catch (error) {
      console.error("다음 노드그룹 요청 실패:", error);
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      // 먼저 진도 확인
      fetchBe("/v1/progress/end", {
        method: "POST",
        body: {
          nodeGroupId: currentNodeGroupId,
        },
      });

      const next = await fetchNextNodeGroup(currentNodeGroupId);
      if (next?.nodeGroupId) {
        navigate(
          `/club/${club}/course/${course_name}/nodegroup/${next.nodeGroupId}`
        );
      } else {
        setOpenModal(true);
      }
    } catch (error) {
      console.error("노드 그룹 이동 중 오류:", error);
      alert("이동 중 오류가 발생했습니다.");
    }
  };

  const handleGoToCourse = () => {
    if (club && course_name) {
      navigate(`/club/${club}/course/${course_name}`);
    } else {
      navigate("/club");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{ padding: "8px 16px", marginTop: "20px" }}
      >
        NEXT
      </button>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>마지막 강의입니다</DialogTitle>
        <DialogContent>
          <Typography>
            이 코스의 모든 강의를 완료했습니다.
            <br />
            코스 페이지로 돌아가시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            닫기
          </Button>
          <Button
            onClick={handleGoToCourse}
            variant="contained"
            color="primary"
          >
            코스로 이동
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NextNodeGroupButton;
