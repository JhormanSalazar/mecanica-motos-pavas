import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Users, ClipboardList, FileText } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
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
          pilots: pilotsRes.data.length,
          items: itemsRes.data.length,
          worklogs: logsRes.data.length,
          recentLogs: logsRes.data.slice(0, 5),
        });
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { label: 'Pilotos', value: stats?.pilots ?? 0, icon: <Users size={32} />, color: '#1976d2' },
    { label: 'Items Checklist', value: stats?.items ?? 0, icon: <ClipboardList size={32} />, color: '#388e3c' },
    { label: 'Servicios realizados', value: stats?.worklogs ?? 0, icon: <FileText size={32} />, color: '#f57c00' },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Resumen General
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Últimos servicios */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Últimos Servicios
      </Typography>

      {stats?.recentLogs?.length === 0 ? (
        <Typography color="text.secondary">No hay servicios registrados aún.</Typography>
      ) : (
        <Grid container spacing={2}>
          {stats?.recentLogs?.map((log) => (
            <Grid size={{ xs: 12, md: 6 }} key={log.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {log.pilot?.name} — {log.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Horas: {log.hours} | Fecha: {new Date(log.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
