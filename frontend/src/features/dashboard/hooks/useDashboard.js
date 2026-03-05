import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import { fetchDashboardStats } from '../api/dashboardApi';

export function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDailyData(logs) {
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = logs.filter((log) => {
      const d = new Date(log.createdAt);
      return d >= dayStart && d <= dayEnd;
    }).length;

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    days.push({
      name: dayNames[dayStart.getDay()],
      servicios: count,
    });
  }
  return days;
}

function getMonthlyServiceCount(logs) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return logs.filter((log) => new Date(log.createdAt) >= startOfMonth).length;
}

export default function useDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error cargando estadisticas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const dailyData = useMemo(
    () => (stats ? getDailyData(stats.worklogs) : []),
    [stats],
  );

  const monthlyCount = useMemo(
    () => (stats ? getMonthlyServiceCount(stats.worklogs) : 0),
    [stats],
  );

  const pendingCount = useMemo(
    () => (stats ? stats.worklogs.filter(log => log.state === 'PENDIENTE').length : 0),
    [stats],
  );

  const activePilots = useMemo(
    () => (stats ? stats.pilots.length : 0),
    [stats],
  );


  const servicesInProgress = useMemo(
    () => (stats ? stats.worklogs.filter(log => log.state === 'EN_PROCESO').length : 0),
    [stats],
  );

  const totalWorklogs = stats?.worklogs?.length ?? 0;

  const recentLogs = useMemo(
    () => stats?.worklogs?.slice(0, 5) ?? [],
    [stats],
  );

  const handleCardClick = (cardLabel, route) => {
  // Mantenemos esto si aún quieres que la card se resalte visualmente
  setSelectedCard({ label: cardLabel, route });
  
  // Navegación inmediata
  if (route) {
    navigate(route);
  }
};

  const handleNavigate = (route) => {
    navigate(route);
  };

  return {
    loading,
    isMobile,
    selectedCard,
    dailyData,
    monthlyCount,
    pendingCount,
    activePilots,
    servicesInProgress,
    totalWorklogs,
    recentLogs,
    handleCardClick,
    handleNavigate,
  };
}
