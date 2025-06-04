import { Typography, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export interface SectionProps {
  text: string;
  onEdit?: () => void;
}

const Section: React.FC<SectionProps> = ({ text, onEdit }) => {
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
      {onEdit && (
        <IconButton size="small" onClick={onEdit} sx={{ color: "#fff" }}>
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};

export default Section;
