import { Box, Button, Chip } from "@mui/material";
import { Save } from "lucide-react";
import {
  actionsContainerSx,
  saveButtonSx,
  terminateButtonSx,
} from "../styles/newServiceStyles";

export default function ServiceActions({
  isEditMode,
  submitting,
  terminating,
  createdServiceId,
  allItemsCompleted,
  handleTerminateService,
  isInProcess,
  saving,
}) {
  return (
    <Box sx={actionsContainerSx}>
      {isInProcess && (
        <Chip label={saving ? "Guardando..." : "En Proceso"} color="warning" sx={{ mr: 2 }} />
      )}
      <Button
        type="submit"
        variant="contained"
        size="large"
        startIcon={<Save size={20} />}
        disabled={submitting || terminating || saving}
        sx={saveButtonSx}
      >
        {submitting
          ? isEditMode
            ? "Actualizando..."
            : "Guardando..."
          : isEditMode
            ? "Actualizar Servicio"
            : "Guardar Servicio"}
      </Button>

      {(isEditMode || createdServiceId) && (
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<Save size={20} />}
          disabled={!allItemsCompleted() || terminating || submitting || saving}
          onClick={handleTerminateService}
          sx={terminateButtonSx}
          title={
            !allItemsCompleted()
              ? "Todos los ítems deben estar marcados como SI"
              : ""
          }
        >
          {terminating ? "Terminando..." : "Terminar Servicio"}
        </Button>
      )}
    </Box>
  );
}
