import { Box, Typography } from "@mui/material";
import { FileText } from "lucide-react";

export default function WorkLogsHeader() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          flexShrink: 0,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <FileText size={20} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
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
