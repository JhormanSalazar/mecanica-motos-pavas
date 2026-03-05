import { Fab } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { mobileFabSx } from '../styles/dashboardStyles';

export default function MobileFab({ isMobile, selectedCard, onFabClick }) {
  if (!isMobile || !selectedCard) return null;

  return (
    <Fab
      color="primary"
      aria-label="navegar"
      onClick={onFabClick}
      sx={mobileFabSx}
    >
      <ArrowRight size={24} />
    </Fab>
  );
}
