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

function getWeeklyData(logs) {
  const now = new Date();
  const weeks = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const count = logs.filter((log) => {
      const d = new Date(log.createdAt);
      return d >= weekStart && d < weekEnd;
    }).length;

    weeks.push({
      name: `Sem ${8 - i}`,
      servicios: count,
    });
  }
  return weeks;
}

function getMonthlyServiceCount(logs) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return logs.filter((log) => new Date(log.createdAt) >= startOfMonth).length;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const weeklyData = useMemo(
    () => (stats ? getWeeklyData(stats.worklogs) : []),
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  const kpiCards = [
    {
      label: 'Servicios este mes',
      value: monthlyCount,
      icon: <TrendingUp size={24} />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      label: 'Pilotos activos',
      value: activePilots,
      icon: <Users size={24} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Total servicios',
      value: stats?.worklogs?.length ?? 0,
      icon: <FileText size={24} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
    {
      label: 'Items checklist activos',
      value: activeItems,
      icon: <ClipboardList size={24} />,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
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
            <Card sx={{ height: '100%' }}>
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
                    Servicios realizados por semana
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
                  <AreaChart data={weeklyData}>
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
    </Box>
  );
}
