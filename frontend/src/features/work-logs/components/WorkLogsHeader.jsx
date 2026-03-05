import { Box, Typography } from "@mui/material";
import { FileText } from "lucide-react";
import { headerContainerSx, headerIconBoxSx, headerTextContainerSx } from "../styles/workLogsStyles";

export default function WorkLogsHeader() {
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerIconBoxSx}>
        <FileText size={20} />
      </Box>
      <Box sx={headerTextContainerSx}>
        <Typography variant="h6" fontWeight={800} noWrap>
          Historial de Servicios
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Registros de mantenimiento realizados
        </Typography>
      </Box>
    </Box>
  );
}
