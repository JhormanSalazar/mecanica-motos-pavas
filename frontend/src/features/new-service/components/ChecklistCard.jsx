import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Collapse,
} from "@mui/material";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import {
  checklistHeaderSx,
  checklistItemRowSx,
  itemNameSx,
  itemControlsSx,
  toggleButtonSx,
  observationIconButtonSx,
  observationBoxSx,
} from "../styles/newServiceStyles";

export default function ChecklistCard({
  results,
  expandedObs,
  checklistExpanded,
  setChecklistExpanded,
  handleStatusChange,
  handleObsChange,
  toggleObservation,
}) {
  return (
    <Card>
      <CardContent>
        <Box
          onClick={() => setChecklistExpanded(!checklistExpanded)}
          sx={checklistHeaderSx(checklistExpanded)}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Checklist de Ítems del Sistema
          </Typography>
          <IconButton size="small">
            {checklistExpanded ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </IconButton>
        </Box>

        <Collapse in={checklistExpanded} timeout="auto">
          {results.map((item, index) => (
            <Box key={item.itemId}>
              <Box sx={checklistItemRowSx}>
                <Typography sx={itemNameSx}>{item.name}</Typography>

                <Box sx={itemControlsSx}>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={item.status}
                    onChange={(_e, val) => {
                      if (val !== null) handleStatusChange(index, val);
                    }}
                    sx={{ flexShrink: 0 }}
                  >
                    <ToggleButton value="SI" color="success" sx={toggleButtonSx}>
                      SI
                    </ToggleButton>
                    <ToggleButton value="NO" color="error" sx={toggleButtonSx}>
                      NO
                    </ToggleButton>
                  </ToggleButtonGroup>

                  <IconButton
                    size="small"
                    onClick={() => toggleObservation(index)}
                    color={expandedObs[index] ? "primary" : "default"}
                    sx={observationIconButtonSx(!!expandedObs[index])}
                  >
                    <MessageSquare size={18} />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={expandedObs[index]} timeout="auto" unmountOnExit>
                <Box sx={observationBoxSx}>
                  <TextField
                    label="Observaciones"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={item.obs}
                    onChange={(e) => handleObsChange(index, e.target.value)}
                    placeholder="Escribe observaciones adicionales..."
                  />
                </Box>
              </Collapse>

              {index < results.length - 1 && <Divider />}
            </Box>
          ))}

          {results.length === 0 && (
            <Typography color="text.secondary">
              No hay ítems de checklist activos. Crea algunos desde la sección
              "Checklist Items".
            </Typography>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
}
