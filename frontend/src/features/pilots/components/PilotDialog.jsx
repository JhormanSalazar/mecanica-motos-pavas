import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { dialogContentSx } from "../styles/pilotsStyles";

export default function PilotDialog({
  open,
  editId,
  form,
  onFormChange,
  onSave,
  onClose,
}) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{editId ? "Editar Piloto" : "Nuevo Piloto"}</DialogTitle>
        <DialogContent sx={dialogContentSx}>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => onFormChange("name", e.target.value)}
            required
          />
          <TextField
            label="Tipo de Moto"
            value={form.bikeType}
            onChange={(e) => onFormChange("bikeType", e.target.value)}
            required
          />
          <TextField
            label="Telefono"
            value={form.phone}
            onChange={(e) => onFormChange("phone", e.target.value)}
          />
          <TextField
            label="Email"
            value={form.email}
            required
            type="email"
            onChange={(e) => onFormChange("email", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
