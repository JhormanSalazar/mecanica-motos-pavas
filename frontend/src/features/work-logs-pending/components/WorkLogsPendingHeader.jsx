import { Box, Typography } from "@mui/material";
import { Hourglass } from "lucide-react";
import {
  headerWrapperSx,
  headerIconBoxSx,
  headerTextBoxSx,
} from "../styles/workLogsPendingStyles";

export default function WorkLogsPendingHeader() {
  return (
    <Box sx={headerWrapperSx}>
      <Box sx={headerIconBoxSx}>
        <Hourglass size={20} />
      </Box>
      <Box sx={headerTextBoxSx}>
        <Typography variant="h6" fontWeight={800} noWrap>
          Servicios Pendientes
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Servicios de mantenimiento en estado PENDIENTE
        </Typography>
      </Box>
    </Box>
  );
}
