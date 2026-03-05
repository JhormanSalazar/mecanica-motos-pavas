import { Box, Typography } from '@mui/material';
import { Wrench } from 'lucide-react';
import { loginHeaderSx } from '../styles/loginStyles';

export default function LoginHeader() {
  return (
    <Box sx={loginHeaderSx}>
      <Wrench size={48} color="#1976d2" />
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
        Taller Motocross
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Ingresa tus credenciales para continuar
      </Typography>
    </Box>
  );
}
