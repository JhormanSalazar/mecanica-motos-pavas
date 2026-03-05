import { Box, TextField, Button, Typography } from "@mui/material";
import { formContainerSx } from "../styles/myConfigStyles";

export default function PasswordChangeForm({
  actualPassword,
  setActualPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  submitting,
  handleSubmit,
}) {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={formContainerSx}>
        <Box>
        <Typography variant={{ xs: "h6", sm: "h5", md: "h4" }} fontWeight={600} gutterBottom>
          Cambiar Contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Actualiza tu contraseña para mantener tu cuenta segura
        </Typography>
        </Box>

      <TextField
        label="Contraseña actual"
        type="password"
        required
        value={actualPassword}
        onChange={(e) => setActualPassword(e.target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="Contraseña nueva"
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="Confirmar contraseña nueva"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        size="small"
      />

      <Button variant="contained" type="submit" disabled={submitting}>
        Guardar
      </Button>
    </Box>
  );
}
