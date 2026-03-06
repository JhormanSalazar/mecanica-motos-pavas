import { memo } from 'react';
import { Box, Divider } from '@mui/material';
import SidebarHeader from './components/SidebarHeader';
import SidebarNav from './components/SidebarNav';
import SidebarPavasLogo from './components/SidebarPavasLogo';
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
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          p: 0,
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

      {/* Navigation Section - Takes all available space */}
      <SidebarNav
        menuItems={menuItems}
        currentPath={currentPath}
        expanded={expanded}
        isMobile={isMobile}
        onNavigate={onNavigate}
      />

      <Divider />

      {/* Bottom Section - Anchored to bottom */}
      <Box
        sx={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SidebarPavasLogo expanded={expanded} isMobile={isMobile} />

        <Divider />

        <SidebarFooter
          user={user}
          expanded={expanded}
          isMobile={isMobile}
          onLogout={onLogout}
        />
      </Box>
    </Box>
  );
}

export default memo(SidebarContent);
