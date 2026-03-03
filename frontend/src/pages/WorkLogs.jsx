import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import api from '../api/axios';

export default function WorkLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await api.get('/worklogs');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Historial de Servicios
      </Typography>

      {logs.length === 0 ? (
        <Typography color="text.secondary">No hay servicios registrados aún.</Typography>
      ) : (
        <Grid container spacing={2}>
          {logs.map((log) => (
            // Nota: En MUI v6+ se usa 'size', en v5 se usa 'xs', 'md', etc. directamente.
            <Grid item xs={12} md={6} key={log.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {log.pilot?.name}
                    </Typography>
                    <Chip
                      label={log.type}
                      size="small"
                      color={log.type === 'ALISTAMIENTO' ? 'primary' : 'warning'}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Horas: {log.hours} | {new Date(log.createdAt).toLocaleString()}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {/* Iteración directa sobre el array relacional */}
                  {log.results && log.results.map((r) => (
                    <Box key={r.id} display="flex" alignItems="flex-start" gap={1} py={0.3}>
                      <Chip
                        label={r.status}
                        size="small"
                        color={r.status === 'SI' ? 'success' : 'error'}
                        sx={{ 
                          width: 40, 
                          minWidth: 40, 
                          height: 20, 
                          fontSize: 10, 
                          fontWeight: 'bold' 
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                          {r.name}
                        </Typography>
                        {r.obs && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Obs: {r.obs}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}