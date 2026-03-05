import { Box, Button } from "@mui/material";
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
}) {
  return (
    <Box sx={actionsContainerSx}>
      <Button
        type="submit"
        variant="contained"
        size="large"
        startIcon={<Save size={20} />}
        disabled={submitting || terminating}
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
          disabled={!allItemsCompleted() || terminating || submitting}
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
