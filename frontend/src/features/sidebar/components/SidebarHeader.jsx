import { Box } from '@mui/material';

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
      }}
      onClick={onToggle}
    >
      <Box
        component="img"
        src="/logo-skm.jpeg"
        alt="SKM"
        sx={{
          width: isFullSize ? '100%' : '40px',
          height: isFullSize ? '54px' : '40px',
          borderRadius: 1.5,
          objectFit: isFullSize ? 'cover' : 'contain',
        }}
      />
    </Box>
  );
}

export default SidebarHeader;
