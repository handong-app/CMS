import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export interface AddSectionButtonProps {
  onAddSection?: (section: {
    title: string;
    description: string;
    order: number;
  }) => void;
  label?: string;
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({
  onAddSection,
  label,
}) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    order: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (onAddSection) onAddSection(form);
    setOpen(false);
    setForm({ title: "", description: "", order: 1 });
  };

  return (
    <>
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          {label || "새로운 Section 만들기"}
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>새로운 Section 만들기</DialogTitle>
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
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title || !form.description || !form.order}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSectionButton;
