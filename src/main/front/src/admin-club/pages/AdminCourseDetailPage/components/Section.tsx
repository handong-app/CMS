import { Typography, Paper, IconButton, Box, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export interface SectionProps {
  text: string;
  onEdit?: () => void;
  onAddPage?: () => void;
}

const Section: React.FC<SectionProps> = ({ text, onEdit, onAddPage }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        background: "rgba(250, 250, 250, 0.14)",
        color: "#fff",
        borderRadius: 2,
        mt: 1,
        px: 1.5,
        py: 0.5,
        fontSize: 15,
        fontWeight: 500,
        minHeight: 48,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        component="span"
        sx={{ fontWeight: 500, fontSize: 15, color: "inherit" }}
      >
        {text}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5}>
        {onAddPage && (
          <Tooltip title="새 페이지 추가">
            <IconButton size="small" onClick={onAddPage} sx={{ color: "#fff" }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="섹션 수정">
            <IconButton size="small" onClick={onEdit} sx={{ color: "#fff" }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default Section;
