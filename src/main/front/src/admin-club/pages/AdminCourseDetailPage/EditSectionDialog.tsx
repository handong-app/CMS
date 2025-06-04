import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchBe } from "../../../tools/api";
import { title } from "process";

export interface EditSectionDialogProps {
  open: boolean;
  section: {
    id: string;
    title: string;
    description: string;
    order: number;
    nodeGroups?: any;
  };
  onClose: () => void;
  onSave: (section: {
    id: string;
    title: string;
    description: string;
    order: number;
    nodeGroups?: any;
  }) => void;
}

const EditSectionDialog: React.FC<EditSectionDialogProps> = ({
  open,
  section,
  onClose,
  onSave,
}) => {
  const fetchBe = useFetchBe();

  const [form, setForm] = useState(section);

  useEffect(() => {
    setForm(section);
  }, [section]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    await fetchBe(`/v1/clubs/_/courses/_/sections/${section.id}`, {
      method: "PATCH",
      body: {
        title: form.title,
        description: form.description,
        order: form.order,
      },
    });
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>섹션 정보 수정</DialogTitle>
      <DialogContent sx={{ minWidth: 340 }}>
        <TextField
          label="섹션명"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="설명"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <TextField
          label="순서 (숫자)"
          name="order"
          type="number"
          value={form.order}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!form.title || !form.description || !form.order}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSectionDialog;
