import { Box, Typography } from "@mui/material";
import { Plus, Users } from "lucide-react";
import ResponsiveButton from "../../../components/ResponsiveButton";
import {
  headerContainerSx,
  headerLeftSx,
  headerIconBoxSx,
  headerTextBoxSx,
  subtitleSx,
} from "../styles/pilotsStyles";

export default function PilotsHeader({ onAdd }) {
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerLeftSx}>
        <Box sx={headerIconBoxSx}>
          <Users size={20} />
        </Box>
        <Box sx={headerTextBoxSx}>
          <Typography variant="h6" fontWeight={800} noWrap>
            Pilotos
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={subtitleSx}
          >
            Gestiona los pilotos
          </Typography>
        </Box>
      </Box>
      <ResponsiveButton
        variant="contained"
        startIcon={<Plus size={18} />}
        onClick={onAdd}
      >
        Nuevo Piloto
      </ResponsiveButton>
    </Box>
  );
}
