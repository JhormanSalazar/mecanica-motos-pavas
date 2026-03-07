import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import {
  kpiGridSx,
  kpiCardBaseSx,
  kpiCardContentSx,
  kpiCardInnerSx,
  kpiLabelSx,
  kpiIconBoxSx,
} from "../styles/dashboardStyles";

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
      label: "Servicios Pendientes",
      value: pendingCount,
      icon: <img src="/icono-tuerca-engranaje.png" alt="Moto" width={44} height={44} />,
      color: "#d32f2f",
      bgColor: "#fff",
      route: "/worklogs-pending",
    },
    {
      label: "Servicios en proceso",
      value: servicesInProgress,
      icon:  <img src="/icono-moto-reparacion.jpeg" alt="Moto" width={70} height={60} />,
      color: "#f57f17",
      bgColor: "#fff",
      route: "/worklogs-in-progress",
    },
    {
      label: "Servicios Terminados",
      value: terminatedCount,
      icon: <img src="/servicios-terminados-icono.jpeg" alt="Moto" width={100} height={100} />,
      color: "#f57c00",
      bgColor: "#fff",
      route: "/worklogs-completed",
    },
    {
      label: "Pilotos activos",
      value: activePilots,
      icon: (
        <img src="/pilotos-activos-icon.jpeg" alt="Moto" width={82} height={90} />
      ),
      color: "#2e7d32",
      bgColor: "#fff",
      route: "/pilots",
    },
  ];

  return (
    <Grid container spacing={2.5} sx={kpiGridSx}>
      {kpiCards.map((card) => (
        <Grid size={{ xs: 12, sm: 6 }} key={card.label}>
          <Card
            sx={{
              ...kpiCardBaseSx,
              ...(selectedCard?.label === card.label &&
                isMobile && {
                  boxShadow: `0 0 0 2px ${card.color}`,
                }),
            }}
            onClick={() => onCardClick(card.label, card.route)}
          >
            <CardContent sx={kpiCardContentSx}>
              <Box sx={kpiCardInnerSx}>
                <Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={kpiLabelSx}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      color: card.color,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" },
                    }}
                  >
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
