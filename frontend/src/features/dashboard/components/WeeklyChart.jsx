import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  chartCardSx,
  chartHeaderSx,
  chartHeaderTextBoxSx,
  chartContainerSx,
  tooltipContentStyle,
} from '../styles/dashboardStyles';

export default function WeeklyChart({ dailyData, totalWorklogs }) {
  return (
    <Card sx={chartCardSx}>
      <CardContent>
        <Box sx={chartHeaderSx}>
          <Box sx={chartHeaderTextBoxSx}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              Tendencia de servicios
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Servicios realizados en los últimos 7 días
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUp size={14} />}
            label={`${totalWorklogs} total`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Box sx={chartContainerSx}>
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
                contentStyle={tooltipContentStyle}
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
  );
}
