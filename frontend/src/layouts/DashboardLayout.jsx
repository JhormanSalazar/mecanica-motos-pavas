import { useState, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CssBaseline, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Menu, LayoutDashboard, Users, ClipboardList, FilePlus, FileText } from 'lucide-react';
import SidebarContent from '../components/layout/SidebarContent';
import SidebarWrapper, { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from '../components/layout/SidebarWrapper';
import ResponsiveMain from '../components/layout/ResponsiveMain';

const menuItems = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Pilotos', path: '/pilots', icon: <Users size={20} /> },
  { label: 'Items', path: '/checklist-items', icon: <ClipboardList size={20} /> },
  { label: 'Nuevo Servicio', path: '/new-service', icon: <FilePlus size={20} /> },
  { label: 'Historial', path: '/worklogs', icon: <FileText size={20} /> },
  { label: 'Usuarios', path: '/users', icon: <Users size={20} /> },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const currentDrawerWidth = isMobile ? 0 : (desktopOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  }, [navigate, isMobile]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleToggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setDesktopOpen((prev) => !prev);
    }
  }, [isMobile]);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);
  const handleMobileOpen = useCallback(() => setMobileOpen(true), []);

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.path === "/users") {
      return user?.role === "ADMIN";
    }
    return true;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <SidebarWrapper
        mobileOpen={mobileOpen}
        desktopOpen={desktopOpen}
        isMobile={isMobile}
        onMobileOpen={handleMobileOpen}
        onMobileClose={handleMobileClose}
      >
        <SidebarContent
          menuItems={filteredMenuItems}
          desktopOpen={desktopOpen}
          isMobile={isMobile}
          user={user}
          currentPath={location.pathname}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          onToggle={handleToggle}
          onClose={handleMobileClose}
        />
      </SidebarWrapper>

      <ResponsiveMain component="main" drawerWidth={currentDrawerWidth}>
        {/* Barra inline movil */}
        {isMobile && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            mx: -0.5,
          }}>
            <IconButton
              onClick={handleMobileOpen}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <Menu size={20} />
            </IconButton>
            <Box sx={{
              width: 26,
              height: 26,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 11,
            }}>
              MX
            </Box>
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              Taller MX
            </Typography>
          </Box>
        )}

        <Outlet />
      </ResponsiveMain>
    </Box>
  );
}
