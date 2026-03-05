import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { emailFieldSx, roleSelectSx } from "../styles/usersStyles";

export default function UserDialog({
  open,
  onClose,
  form,
  editId,
  showPassword,
  setShowPassword,
  onEmailChange,
  onRoleChange,
  onPasswordChange,
  onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editId ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formEl = e.target;
            if (formEl.checkValidity()) {
              onSave();
            } else {
              formEl.reportValidity();
            }
          }}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            sx={emailFieldSx}
            disabled={!!editId}
          />
          <Select
            fullWidth
            value={form.role}
            onChange={(e) => onRoleChange(e.target.value)}
            displayEmpty
            required
            sx={roleSelectSx}
          >
            <MenuItem value="">Seleccione un rol</MenuItem>
            <MenuItem value="MECHANIC">{"Mec\u00e1nico"}</MenuItem>
            <MenuItem value="ADMIN">Administrador</MenuItem>
          </Select>
          {!editId && (
            <TextField
              fullWidth
              label={"Contrase\u00f1a"}
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
