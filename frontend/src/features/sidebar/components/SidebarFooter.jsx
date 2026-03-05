import { Box, Typography, Button, Tooltip, IconButton } from '@mui/material';
import { LogOut } from 'lucide-react';

const ICON_SIZE = 20;

function SidebarFooter({ user, expanded, isMobile, onLogout }) {
  if (expanded || isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {user?.email}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 1 }}
        >
          Rol: {user?.role}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogOut size={16} />}
          onClick={onLogout}
        >
          Cerrar sesion
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Tooltip title="Cerrar sesion" placement="right">
        <IconButton color="error" onClick={onLogout} sx={{ width: '100%' }}>
          <LogOut size={ICON_SIZE} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default SidebarFooter;
