import { Box, Typography } from "@mui/material";
import { Clock } from "lucide-react";
import {
  headerWrapperSx,
  headerIconBoxSx,
  headerTextBoxSx,
} from "../styles/workLogsInProgressStyles";

export default function WorkLogsInProgressHeader() {
  return (
    <Box sx={headerWrapperSx}>
      <Box sx={headerIconBoxSx}>
        <Clock size={20} />
      </Box>
      <Box sx={headerTextBoxSx}>
        <Typography variant="h6" fontWeight={800} noWrap>
          Servicios en Proceso
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Servicios de mantenimiento pendientes de finalizar
        </Typography>
      </Box>
    </Box>
  );
}
