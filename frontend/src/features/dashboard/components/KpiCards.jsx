import {
  Box, Grid, Card, CardContent, Typography,
} from '@mui/material';
import {
  Users, Hourglass, CheckCircle, Clock,
} from 'lucide-react';
import {
  kpiGridSx,
  kpiCardBaseSx,
  kpiCardContentSx,
  kpiCardInnerSx,
  kpiLabelSx,
  kpiIconBoxSx,
} from '../styles/dashboardStyles';

export default function KpiCards({
  servicesInProgress,
  pendingCount,
  activePilots,
  terminatedCount,
  selectedCard,
  isMobile,
  onCardClick,
}) {
  const kpiCards = [
    {
      label: 'Servicios Pendientes',
      value: pendingCount,
      icon: <Hourglass size={24} />,
      color: '#d32f2f',
      bgColor: '#ffebee',
      route: '/worklogs-pending',
    },
    {
      label: 'Servicios en proceso',
      value: servicesInProgress,
      icon: <Clock size={24} />,
      color: '#f57f17',
      bgColor: '#fff8e1',
      route: '/worklogs-in-progress',
    },
    {
      label: 'Servicios Terminados',
      value: terminatedCount,
      icon: <CheckCircle size={24} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
      route: '/worklogs-completed',
    },
    {
      label: 'Pilotos activos',
      value: activePilots,
      icon: <Users size={24} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      route: '/pilots',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={kpiGridSx}>
      {kpiCards.map((card) => (
        <Grid size={{ xs: 12, sm: 6 }} key={card.label}>
          <Card
            sx={{
              ...kpiCardBaseSx,
              ...(selectedCard?.label === card.label && isMobile && {
                boxShadow: `0 0 0 2px ${card.color}`,
              }),
            }}
            onClick={() => onCardClick(card.label, card.route)}
          >
            <CardContent sx={kpiCardContentSx}>
              <Box sx={kpiCardInnerSx}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={kpiLabelSx}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ 
                    color: card.color,
                    fontSize: { xs: '1.5rem', sm: '2.125rem', md: '2.75rem' } }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={kpiIconBoxSx(card.bgColor, card.color)}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
