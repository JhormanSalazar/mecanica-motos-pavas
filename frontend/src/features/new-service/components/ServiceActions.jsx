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
  lastSavedAt,
}) {
  return (
    <Box sx={actionsContainerSx}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* When editing, rely on autosave and hide the manual 'Actualizar Servicio' button */}
        {!isEditMode && (
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save size={20} />}
            disabled={submitting || terminating || saving}
            sx={saveButtonSx}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        )}

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
            {terminating ? "Terminando..." : "Terminar"}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {saving ? (
          <Chip label="Guardando..." color="warning" />
        ) : lastSavedAt ? (
          <Chip label="Guardado automático" color="success" />
        ) : isInProcess ? (
          <Chip label="En Proceso" color="warning" />
        ) : null}
      </Box>
    </Box>
  );
}
