import {
  TextField, Button, InputAdornment, IconButton,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { loginSubmitButtonSx } from '../styles/loginStyles';

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
        autoFocus
      />
      <TextField
        fullWidth
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={loginSubmitButtonSx}
      >
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
}
