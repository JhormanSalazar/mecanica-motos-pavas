import { Box, Typography } from '@mui/material';
import { LayoutDashboard } from 'lucide-react';
import { sectionHeaderSx, sectionHeaderIconBoxSx, sectionHeaderTextBoxSx } from '../styles/dashboardStyles';

export default function DashboardHeader() {
  return (
    <Box sx={sectionHeaderSx}>
      <Box sx={sectionHeaderIconBoxSx}>
        <LayoutDashboard size={20} />
      </Box>
      <Box sx={sectionHeaderTextBoxSx}>
        <Typography variant="h6" fontWeight={800} noWrap>Panel Principal</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Vista general del taller y actividad reciente
        </Typography>
      </Box>
    </Box>
  );
}
