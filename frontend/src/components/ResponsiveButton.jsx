import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Creamos el componente estilizado
const StyledResponsiveButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  
  // Estilos para pantallas pequeñas (móviles < 600px)
  [theme.breakpoints.down('sm')]: {
    minWidth: 40,
    width: 40,
    height: 40,
    padding: 0,
    // Centramos el icono eliminando el margen que MUI pone por defecto
    '& .MuiButton-startIcon': {
      margin: 0,
    },
    // Escondemos el texto que venga dentro del botón
    '& .button-text': {
      display: 'none',
    },
  },
}));

// Un wrapper sencillo para facilitar su uso
export default function ResponsiveButton({ children, ...props }) {
  return (
    <StyledResponsiveButton {...props}>
      <span className="button-text">{children}</span>
    </StyledResponsiveButton>
  );
}