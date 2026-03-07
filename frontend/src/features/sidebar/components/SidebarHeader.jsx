import { Box, Typography } from '@mui/material';

function SidebarHeader({ expanded, isMobile, onToggle }) {
  const isFullSize = expanded || isMobile;

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
        px: isFullSize ? 1 : 1,
        py: isFullSize ? 1.5 : 1,
        overflow: 'hidden',
        minHeight: isFullSize ? 'auto' : 56,
      }}
      onClick={onToggle}
    >
      {isFullSize ? (
        <Box
          component="img"
          src="/logo-skm.png"
          alt="SKM"
          sx={{
            width: '100%',
            height: 'auto',
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
          <Box
            component="img"
            src="/logo-skm-only-icon.png"
            alt="SKM"
            sx={{
              width: "100%",
            }}>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default SidebarHeader;
