import {
  Box, Card, CardContent, Typography, Chip, Divider, Button,
} from '@mui/material';
import { Clock, ArrowRight, Wrench } from 'lucide-react';
import { formatDate } from '../hooks/useDashboard';
import {
  activityCardSx,
  activityHeaderSx,
  activityEmptyBoxSx,
  activityLogRowSx,
  activityLogIconBoxSx,
  activityLogTextBoxSx,
  activityHoursChipSx,
  activityViewAllButtonSx,
} from '../styles/dashboardStyles';

export default function RecentActivity({ recentLogs, onNavigate }) {
  return (
    <Card sx={activityCardSx}>
      <CardContent>
        <Box sx={activityHeaderSx}>
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
          <Box sx={activityEmptyBoxSx}>
            <Wrench size={40} color="#ccc" />
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No hay servicios registrados aun.
            </Typography>
          </Box>
        ) : (
          <Box>
            {recentLogs.map((log, index) => (
              <Box key={log.id}>
                <Box sx={activityLogRowSx}>
                  <Box sx={activityLogIconBoxSx(log.type)}>
                    <Wrench size={16} />
                  </Box>
                  <Box sx={activityLogTextBoxSx}>
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
                    sx={activityHoursChipSx}
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
          onClick={() => onNavigate('/worklogs')}
          sx={activityViewAllButtonSx}
        >
          Ver todo el historial
        </Button>
      </CardContent>
    </Card>
  );
}
