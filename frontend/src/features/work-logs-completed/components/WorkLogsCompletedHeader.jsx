import { Box, Typography } from "@mui/material";
import { CheckCircle } from "lucide-react";
import {
  headerWrapperSx,
  headerIconBoxSx,
  headerTextBoxSx,
} from "../styles/workLogsCompletedStyles";

export default function WorkLogsCompletedHeader() {
  return (
    <Box sx={headerWrapperSx}>
      <Box sx={headerIconBoxSx}>
        <CheckCircle size={20} />
      </Box>
      <Box sx={headerTextBoxSx}>
        <Typography variant="h6" fontWeight={800} noWrap>
          Servicios Terminados
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Servicios de mantenimiento con estado TERMINADO
        </Typography>
      </Box>
    </Box>
  );
}
