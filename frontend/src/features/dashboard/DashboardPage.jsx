import { Box, Grid, CircularProgress } from '@mui/material';
import useDashboard from './hooks/useDashboard';
import { loadingContainerSx } from './styles/dashboardStyles';
import DashboardHeader from './components/DashboardHeader';
import KpiCards from './components/KpiCards';
import WeeklyChart from './components/WeeklyChart';
import RecentActivity from './components/RecentActivity';

export default function DashboardPage() {
  const {
    loading,
    isMobile,
    selectedCard,
    dailyData,
    monthlyCount,
    pendingCount,
    terminatedCount,
    activePilots,
    servicesInProgress,
    totalWorklogs,
    recentLogs,
    handleCardClick,
    handleNavigate,
  } = useDashboard();

  if (loading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <DashboardHeader />

      <KpiCards
        servicesInProgress={servicesInProgress}
        pendingCount={pendingCount}
        terminatedCount={terminatedCount}
        activePilots={activePilots}
        
        selectedCard={selectedCard}
        isMobile={isMobile}
        onCardClick={handleCardClick}
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <WeeklyChart dailyData={dailyData} totalWorklogs={totalWorklogs} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentActivity recentLogs={recentLogs} onNavigate={handleNavigate} />
        </Grid>
      </Grid>
    </Box>
  );
}
