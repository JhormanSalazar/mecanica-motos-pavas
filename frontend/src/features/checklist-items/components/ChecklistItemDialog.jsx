import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { dialogContentSx } from "../styles/checklistItemsStyles";

export default function ChecklistItemDialog({
  open,
  onClose,
  form,
  onFormChange,
  editId,
  onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editId ? "Editar Item" : "Nuevo Item"}</DialogTitle>
      <DialogContent sx={dialogContentSx}>
        <TextField
          fullWidth
          label="Nombre del item"
          value={form.name}
          onChange={(e) => onFormChange({ ...form, name: e.target.value })}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
