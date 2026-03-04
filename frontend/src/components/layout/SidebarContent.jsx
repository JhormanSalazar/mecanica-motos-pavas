import { memo } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Tooltip,
} from '@mui/material';
import {
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const ICON_SIZE = 20;

function SidebarHeader({ expanded, isMobile, onToggle, onClose }) {
  if (expanded || isMobile) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src="/logo-skm.jpeg"
            alt="SKM"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              objectFit: 'cover',
            }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
              SKM
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Servicio Tecnico
            </Typography>
          </Box>
        </Box>
        {isMobile ? (
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <X size={18} />
          </IconButton>
        ) : (
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
            <PanelLeftClose size={18} />
          </IconButton>
        )}
      </>
    );
  }

  return (
    <Tooltip title="Expandir menu" placement="right">
      <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
        <PanelLeftOpen size={18} />
      </IconButton>
    </Tooltip>
  );
}

function SidebarNav({ menuItems, currentPath, expanded, isMobile, onNavigate }) {
  return (
    <List sx={{ flex: 1, px: 1, py: 1 }}>
      {menuItems.map((item) => (
        <Tooltip
          key={item.path}
          title={!expanded && !isMobile ? item.label : ''}
          placement="right"
        >
          <ListItemButton
            onClick={() => onNavigate(item.path)}
            selected={currentPath === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              justifyContent: expanded || isMobile ? 'flex-start' : 'center',
              px: expanded || isMobile ? 2 : 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'white' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: expanded || isMobile ? 36 : 'auto', justifyContent: 'center' }}>
              {item.icon}
            </ListItemIcon>
            {(expanded || isMobile) && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      ))}
    </List>
  );
}

function SidebarFooter({ user, expanded, isMobile, onLogout }) {
  if (expanded || isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {user?.email}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
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
        <IconButton
          color="error"
          onClick={onLogout}
          sx={{ width: '100%' }}
        >
          <LogOut size={ICON_SIZE} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function SidebarContent({
  menuItems,
  desktopOpen,
  isMobile,
  user,
  currentPath,
  onNavigate,
  onLogout,
  onToggle,
  onClose,
}) {
  const expanded = desktopOpen || isMobile;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        px: expanded ? 2 : 1,
        py: 1.5,
        minHeight: 56,
      }}>
        <SidebarHeader
          expanded={expanded}
          isMobile={isMobile}
          onToggle={onToggle}
          onClose={onClose}
        />
      </Box>

      <Divider />

      <SidebarNav
        menuItems={menuItems}
        currentPath={currentPath}
        expanded={expanded}
        isMobile={isMobile}
        onNavigate={onNavigate}
      />

      <Divider />

      <SidebarFooter
        user={user}
        expanded={expanded}
        isMobile={isMobile}
        onLogout={onLogout}
      />
    </Box>
  );
}

export default memo(SidebarContent);
