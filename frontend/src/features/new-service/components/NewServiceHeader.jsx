import { Box, Typography } from "@mui/material";
import { FilePlus } from "lucide-react";
import { headerContainerSx, headerIconBoxSx, headerTextBoxSx } from "../styles/newServiceStyles";

export default function NewServiceHeader({ isEditMode }) {
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
    </Box>
  );
}
