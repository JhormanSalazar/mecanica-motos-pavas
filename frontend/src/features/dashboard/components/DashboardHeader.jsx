import { Box, Typography, Fab, Tooltip } from "@mui/material";
import { LayoutDashboard, Plus } from "lucide-react";
import {
  sectionHeaderSx,
  sectionHeaderIconBoxSx,
  sectionHeaderTextBoxSx,
} from "../styles/dashboardStyles";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();
  return (
    <Box sx={{ ...sectionHeaderSx, display: "flex", alignItems: "center" }}>
      <Box sx={sectionHeaderIconBoxSx}>
        <LayoutDashboard size={20} />
      </Box>

      <Box sx={sectionHeaderTextBoxSx}>
        <Typography variant="h6" fontWeight={800} noWrap>
          Panel Principal
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Vista general del taller y actividad reciente
        </Typography>
      </Box>

      {/* Este Box vacío empuja el botón hacia la derecha del todo */}
      <Box sx={{ flex: 1 }} />

      {/* Botón de acción flotante, con estilos responsivos para adaptarse a la barra superior en móvil */}
      <Tooltip title="Nuevo Servicio" placement="left" arrow>
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          sx={{
            boxShadow: 2,
            // Lógica de posición responsiva:
            position: { xs: "fixed", md: "static" },
            top: { xs: 12, md: "auto" },
            right: { xs: 16, md: "auto" },
            zIndex: { xs: 1200, md: "auto" },
            // Ajuste de tamaño para que en móvil se vea más integrado a la barra superior
            width: { xs: 40, md: 40 },
            height: { xs: 40, md: 40 },
          }}
          onClick={() => navigate("/new-service")}
        >
          <Plus size={24} />
        </Fab>
      </Tooltip>
    </Box>
  );
}
