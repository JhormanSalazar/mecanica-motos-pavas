import { Box, Typography, Chip } from "@mui/material";
import { FilePlus } from "lucide-react";
import { headerContainerSx, headerIconBoxSx, headerTextBoxSx } from "../styles/newServiceStyles";

const STATE_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  TERMINADO: 'Terminado',
};

export default function NewServiceHeader({ isEditMode, worklogState, isInProcess }) {
  const displayState = worklogState
    ? (worklogState === 'PENDIENTE' && isInProcess ? 'EN_PROCESO' : worklogState)
    : null;
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerIconBoxSx}>
        <FilePlus size={20} />
      </Box>
      <Box sx={headerTextBoxSx}>
        <Typography variant="h6" fontWeight={800} noWrap>
          {isEditMode ? "Editar Servicio" : "Nuevo Servicio"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {isEditMode
            ? "Actualiza los datos del servicio"
            : "Completa el formulario de alistamiento o reparacion"}
        </Typography>
      </Box>
      {isEditMode && displayState && (
        <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={STATE_LABELS[displayState] || STATE_LABELS.PENDIENTE} size="small" />
        </Box>
      )}
    </Box>
  );
}
