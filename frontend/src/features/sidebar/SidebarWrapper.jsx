import { Drawer, SwipeableDrawer, useTheme } from '@mui/material';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 64;

export { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED };

export default function SidebarWrapper({
  mobileOpen,
  desktopOpen,
  isMobile,
  onMobileOpen,
  onMobileClose,
  children,
}) {
  const theme = useTheme();
  const currentWidth = desktopOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED;

  return (
    <>
      {/* Mobile - SwipeableDrawer con soporte de gesto */}
      <SwipeableDrawer
        variant="temporary"
        open={mobileOpen}
        onOpen={onMobileOpen}
        onClose={onMobileClose}
        disableBackdropTransition
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRadius: 0, // Eliminamos los bordes redondeados
          },
        }}
      >
        {children}
      </SwipeableDrawer>

      {/* Desktop - Drawer permanente colapsable */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: currentWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {children}
      </Drawer>
    </>
  );
}
