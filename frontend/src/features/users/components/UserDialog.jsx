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
  emailError,
  onEmailChange,
  onRoleChange,
  onPasswordChange,
  onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editId ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Email"
          value={form.email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          error={!!emailError}
          helperText={emailError}
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
