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
  Tooltip,
} from '@mui/material';
import {
  Menu,
  LayoutDashboard,
  Users,
  ClipboardList,
  FilePlus,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 64;

const menuItems = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Pilotos', path: '/pilots', icon: <Users size={20} /> },
  { label: 'Items', path: '/checklist-items', icon: <ClipboardList size={20} /> },
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
  const [desktopOpen, setDesktopOpen] = useState(true);

  const currentDrawerWidth = isMobile ? DRAWER_WIDTH : (desktopOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED);

  function handleNavigation(path) {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleDrawerToggle() {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ gap: 1, justifyContent: desktopOpen || isMobile ? 'flex-start' : 'center' }}>
        {(desktopOpen || isMobile) ? (
          <>
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
          </>
        ) : (
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
        )}
      </Toolbar>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.path} 
            title={!desktopOpen && !isMobile ? item.label : ''} 
            placement="right"
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                justifyContent: desktopOpen || isMobile ? 'flex-start' : 'center',
                px: desktopOpen || isMobile ? 2 : 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: desktopOpen || isMobile ? 36 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {(desktopOpen || isMobile) && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14 }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: desktopOpen || isMobile ? 2 : 1 }}>
        {(desktopOpen || isMobile) ? (
          <>
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
          </>
        ) : (
          <Tooltip title="Cerrar sesión" placement="right">
            <IconButton
              color="error"
              onClick={handleLogout}
              sx={{ width: '100%' }}
            >
              <LogOut size={20} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {isMobile ? (
              <Menu size={24} />
            ) : desktopOpen ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </IconButton>
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
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
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
          width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { xs: 0, md: `${currentDrawerWidth}px` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: '#f5f5f5',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
