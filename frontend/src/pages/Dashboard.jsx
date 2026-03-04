import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Divider,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Users,
  ClipboardList,
  FileText,
  LayoutDashboard,
  TrendingUp,
  Clock,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';

function formatDate(value) {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [pilotsRes, itemsRes, logsRes] = await Promise.all([
          api.get('/pilots'),
          api.get('/checklist-items'),
          api.get('/worklogs'),
        ]);
        setStats({
          pilots: pilotsRes.data,
          items: itemsRes.data,
          worklogs: logsRes.data,
        });
      } catch (err) {
        console.error('Error cargando estadisticas:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const dailyData = useMemo(
    () => (stats ? getDailyData(stats.worklogs) : []),
    [stats],
  );

  const monthlyCount = useMemo(
    () => (stats ? getMonthlyServiceCount(stats.worklogs) : 0),
    [stats],
  );

  const activePilots = useMemo(
    () => (stats ? stats.pilots.length : 0),
    [stats],
  );

  const activeItems = useMemo(
    () => (stats ? stats.items.filter((i) => i.isActive).length : 0),
    [stats],
  );

  const servicesInProgress = useMemo(
    () => (stats ? stats.worklogs.filter(log => log.state === 'EN_PROCESO').length : 0),
    [stats],
  );

  const handleCardClick = (cardLabel, route) => {
    if (isMobile) {
      setSelectedCard({ label: cardLabel, route });
    } else {
      navigate(route);
    }
  };

  const handleFabClick = () => {
    if (selectedCard) {
      navigate(selectedCard.route);
      setSelectedCard(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  const kpiCards = [
    {
      label: 'Servicios en proceso',
      value: servicesInProgress,
      icon: <Clock size={24} />,
      color: '#f57f17',
      bgColor: '#fff8e1',
      route: '/worklogs-in-progress',
    },
    {
      label: 'Servicios este mes',
      value: monthlyCount,
      icon: <TrendingUp size={24} />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      route: '/worklogs',
    },
    {
      label: 'Pilotos activos',
      value: activePilots,
      icon: <Users size={24} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      route: '/pilots',
    },
    {
      label: 'Total servicios',
      value: stats?.worklogs?.length ?? 0,
      icon: <FileText size={24} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
      route: '/worklogs',
    },
    {
      label: 'Items checklist activos',
      value: activeItems,
      icon: <ClipboardList size={24} />,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      route: '/checklist-items',
    },
  ];

  const recentLogs = stats?.worklogs?.slice(0, 5) ?? [];

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2, flexShrink: 0,
          bgcolor: 'primary.main', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: 'white',
        }}>
          <LayoutDashboard size={20} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={800} noWrap>Panel Principal</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Vista general del taller y actividad reciente
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {kpiCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(selectedCard?.label === card.label && isMobile && {
                  boxShadow: `0 0 0 2px ${card.color}`,
                }),
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleCardClick(card.label, card.route)}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: 3,
                    bgcolor: card.bgColor, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: card.color,
                  }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Activity */}
      <Grid container spacing={2.5}>
        {/* Weekly Services Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>
                    Tendencia de servicios
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Servicios realizados en los últimos 7 días
                  </Typography>
                </Box>
                <Chip
                  icon={<TrendingUp size={14} />}
                  label={`${stats?.worklogs?.length ?? 0} total`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ width: '100%', height: { xs: 200, sm: 280 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorServicios" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#999' }}
                      axisLine={{ stroke: '#eee' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#999' }}
                      axisLine={{ stroke: '#eee' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        fontSize: 13,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="servicios"
                      stroke="#1976d2"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorServicios)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Actividad reciente
                </Typography>
                <Chip
                  icon={<Clock size={14} />}
                  label="Hoy"
                  size="small"
                  variant="outlined"
                />
              </Box>

              {recentLogs.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Wrench size={40} color="#ccc" />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    No hay servicios registrados aun.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {recentLogs.map((log, index) => (
                    <Box key={log.id}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.5,
                      }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: 2,
                          bgcolor: log.type === 'ALISTAMIENTO' ? '#e3f2fd' : '#fff3e0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: log.type === 'ALISTAMIENTO' ? '#1976d2' : '#f57c00',
                          flexShrink: 0,
                        }}>
                          <Wrench size={16} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {log.pilot?.name || 'Sin piloto'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.type} - {formatDate(log.createdAt)}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${log.hours}h`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      </Box>
                      {index < recentLogs.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                fullWidth
                variant="text"
                size="small"
                endIcon={<ArrowRight size={16} />}
                onClick={() => navigate('/worklogs')}
                sx={{ mt: 2 }}
              >
                Ver todo el historial
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAB para Mobile */}
      {isMobile && selectedCard && (
        <Fab
          color="primary"
          aria-label="navegar"
          onClick={handleFabClick}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            zIndex: 1000,
          }}
        >
          <ArrowRight size={24} />
        </Fab>
      )}
    </Box>
  );
}
