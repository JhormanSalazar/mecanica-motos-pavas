import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import {
  Menu,
  LayoutDashboard,
  Users,
  ClipboardList,
  FilePlus,
  FileText,
  LogOut,
} from 'lucide-react';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Pilotos', path: '/pilots', icon: <Users size={20} /> },
  { label: 'Checklist Items', path: '/checklist-items', icon: <ClipboardList size={20} /> },
  { label: 'Nuevo Servicio', path: '/new-service', icon: <FilePlus size={20} /> },
  { label: 'Historial', path: '/worklogs', icon: <FileText size={20} /> },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavigation(path) {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          MX
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" lineHeight={1.2}>
            Taller MX
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sistema de gestión
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'white' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

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
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <Menu size={24} />
            </IconButton>
          )}
          <Typography variant="h6" noWrap fontWeight="bold">
            {menuItems.find((i) => i.path === location.pathname)?.label || 'Taller Motocross'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar para móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Sidebar permanente para desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: '#f5f5f5',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
