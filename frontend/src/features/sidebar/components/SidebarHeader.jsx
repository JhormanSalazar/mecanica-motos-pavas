import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

function SidebarHeader({ expanded, isMobile, onToggle }) {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm')); // phones

  const isFullSize = expanded || isMobile;

  // Determine image dimensions for expanded state per device
  const expandedMaxWidth = isPhone ? '100px' : '140px';
  const expandedMaxHeight = isPhone ? '60px' : '70px';

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': { opacity: 0.8 },
        p: isFullSize ? 1.5 : 1,
        overflow: 'hidden',
        minHeight: isFullSize ? 'auto' : 56,
      }}
      onClick={onToggle}
    >
      {isFullSize ? (
        <Box
          component="img"
          src="/logo-skm.jpeg"
          alt="SKM"
          sx={{
            maxWidth: expandedMaxWidth,
            maxHeight: expandedMaxHeight,
            height: 'auto',
            width: '100%',
            borderRadius: 1.5,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '50px',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>SK</Typography>
        </Box>
      )}
    </Box>
  );
}

export default SidebarHeader;
