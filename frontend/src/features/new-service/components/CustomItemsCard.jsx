import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Collapse,
} from "@mui/material";
import { MessageSquare, Plus, X } from "lucide-react";
import {
  checklistItemRowSx,
  itemNameSx,
  itemControlsSx,
  toggleButtonSx,
  observationIconButtonSx,
  removeIconButtonSx,
  observationBoxSx,
  customItemsInputRowSx,
  addButtonSx,
} from "../styles/newServiceStyles";

export default function CustomItemsCard({
  type,
  customItems,
  customItemName,
  setCustomItemName,
  expandedCustomObs,
  addCustomItem,
  removeCustomItem,
  handleCustomStatusChange,
  handleCustomObsChange,
  toggleCustomObservation,
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Ítems Propios del Servicio
          {type === "REPARACION" && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              (Requerido)
            </Typography>
          )}
        </Typography>

        <Box sx={customItemsInputRowSx(customItems.length > 0)}>
          <TextField
            size="small"
            fullWidth
            label="Nombre del ítem"
            value={customItemName}
            onChange={(e) => setCustomItemName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomItem();
              }
            }}
            placeholder="Ej: Revisión de motor, Cambio de aceite..."
          />
          <Button
            variant="contained"
            onClick={addCustomItem}
            disabled={!customItemName.trim()}
            sx={addButtonSx}
          >
            <Plus size={20} />
          </Button>
        </Box>

        {customItems.length > 0 && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            {customItems.map((item, index) => (
              <Box key={item.id}>
                <Box sx={checklistItemRowSx}>
                  <Typography sx={itemNameSx}>{item.name}</Typography>

                  <Box sx={itemControlsSx}>
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={item.status || null}
                      onChange={(_e, val) => {
                        // allow deselect -> clear status
                        handleCustomStatusChange(item.id, val ?? "");
                      }}
                      sx={{ flexShrink: 0 }}
                    >
                      <ToggleButton
                        value="SI"
                        color="success"
                        sx={toggleButtonSx}
                      >
                        SI
                      </ToggleButton>
                      <ToggleButton
                        value="NO"
                        color="error"
                        sx={toggleButtonSx}
                      >
                        NO
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => toggleCustomObservation(item.id)}
                        color={
                          expandedCustomObs[item.id] ? "primary" : "default"
                        }
                        sx={observationIconButtonSx(
                          !!expandedCustomObs[item.id]
                        )}
                      >
                        <MessageSquare size={18} />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeCustomItem(item.id)}
                        sx={removeIconButtonSx}
                      >
                        <X size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Collapse
                  in={expandedCustomObs[item.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={observationBoxSx}>
                    <TextField
                      label="Observaciones"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={item.obs}
                      onChange={(e) =>
                        handleCustomObsChange(item.id, e.target.value)
                      }
                      placeholder="Escribe observaciones adicionales..."
                    />
                  </Box>
                </Collapse>

                {index < customItems.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}

        {customItems.length === 0 && (
          <Typography
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Agrega ítems específicos para este servicio
            {type === "REPARACION" && " (obligatorio para reparaciones)"}.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
