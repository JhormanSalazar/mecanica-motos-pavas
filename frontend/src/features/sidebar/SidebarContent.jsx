import { memo } from 'react';
import { Box, Divider } from '@mui/material';
import SidebarHeader from './components/SidebarHeader';
import SidebarNav from './components/SidebarNav';
import SidebarFooter from './components/SidebarFooter';

function SidebarContent({
  menuItems,
  desktopOpen,
  isMobile,
  user,
  currentPath,
  onNavigate,
  onLogout,
  onToggle,
}) {
  const expanded = desktopOpen || isMobile;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          px: expanded ? 2 : 1,
          py: 1.5,
          minHeight: 56,
        }}
      >
        <SidebarHeader
          expanded={expanded}
          isMobile={isMobile}
          onToggle={onToggle}
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
