import { Box, Typography } from "@mui/material";
import ResponsiveButton from "../../../components/ResponsiveButton";
import { Plus, ClipboardList } from "lucide-react";
import {
  headerContainerSx,
  headerLeftSx,
  headerIconBoxSx,
  headerTextBoxSx,
  subtitleSx,
} from "../styles/checklistItemsStyles";

export default function ChecklistItemsHeader({ onNewItem }) {
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerLeftSx}>
        <Box sx={headerIconBoxSx}>
          <ClipboardList size={20} />
        </Box>
        <Box sx={headerTextBoxSx}>
          <Typography variant="h6" fontWeight={800} noWrap>
            Items de Checklist
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={subtitleSx}
          >
            Administra los items disponibles
          </Typography>
        </Box>
      </Box>
      <ResponsiveButton
        variant="contained"
        startIcon={<Plus size={20} />}
        onClick={onNewItem}
      >
        Nuevo Item
      </ResponsiveButton>
    </Box>
  );
}
