import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export interface JoinProgramModalProps {
  open: boolean;
  onClose: () => void;
  onJoin: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

function JoinProgramModal({
  open,
  onClose,
  onJoin,
  loading,
  error,
}: JoinProgramModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>프로그램 등록 필요</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          이 프로그램에 아직 등록되어 있지 않습니다.
          <br />
          등록 후 이동하시겠습니까?
        </Typography>
        {error && (
          <Typography color="error" fontSize={13} mb={1}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={onJoin}
        >
          {loading ? "등록 중..." : "등록하고 이동"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default JoinProgramModal;
