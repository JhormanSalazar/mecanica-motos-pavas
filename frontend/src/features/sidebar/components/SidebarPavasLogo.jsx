import { Box } from '@mui/material';

function SidebarPavasLogo({ expanded, isMobile }) {
  const isFullSize = expanded || isMobile;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: isFullSize ? 2 : 1,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src="/logo-pavas.jpeg"
        alt="Pavas"
        sx={{
          maxWidth: isFullSize ? '140px' : '50px',
          maxHeight: isFullSize ? '60px' : '40px',
          height: 'auto',
          width: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </Box>
  );
}

export default SidebarPavasLogo;
