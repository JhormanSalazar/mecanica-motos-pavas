import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { X, User, Clock, Wrench } from "lucide-react";

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WorkLogDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <Dialog
      open={!!log}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: log.type === "ALISTAMIENTO" ? '#e3f2fd' : '#fff3e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: log.type === "ALISTAMIENTO" ? '#1976d2' : '#f57c00',
            flexShrink: 0,
          }}>
            <Wrench size={16} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body1" fontWeight={700} lineHeight={1.2} noWrap>
              Servicio #{log.id}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {formatDate(log.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <Chip
            label={log.type}
            color={log.type === "ALISTAMIENTO" ? "primary" : "warning"}
            size="small"
            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 24 }}
          />
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <X size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: '#fafafa' }}>
        {/* Info cards - stack on very small screens */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          mb: 2,
          mt: 1,
        }}>
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            bgcolor: "white",
            borderRadius: 2,
            border: '1px solid #eee',
          }}>
            <Box sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1976d2',
              flexShrink: 0,
            }}>
              <User size={14} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, fontSize: '0.6rem' }}>
                Piloto
              </Typography>
              <Typography variant="body2" fontWeight={700} noWrap>
                {log.pilot?.name || 'Sin asignar'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            bgcolor: "white",
            borderRadius: 2,
            border: '1px solid #eee',
          }}>
            <Box sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: '#fff3e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f57c00',
              flexShrink: 0,
            }}>
              <Clock size={14} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, fontSize: '0.6rem' }}>
                Horas
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {log.hours}h
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Checklist section */}
        <Typography variant="caption" sx={{
          mb: 1,
          fontWeight: 700,
          color: "text.secondary",
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          display: 'block',
          textAlign: 'center',
        }}>
          Checklist de verificacion
        </Typography>

        <Box sx={{
          bgcolor: 'white',
          borderRadius: 2,
          border: '1px solid #eee',
          overflow: 'hidden',
        }}>
          {log.results?.map((r, index) => (
            <Box key={r.id}>
              <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={600} sx={{ minWidth: 0, wordBreak: 'break-word' }}>
                    {r.name}
                  </Typography>
                  <Chip
                    label={r.status}
                    size="small"
                    variant={r.status === "SI" ? "filled" : "outlined"}
                    color={r.status === "SI" ? "success" : "error"}
                    sx={{ fontWeight: 800, minWidth: 42, fontSize: '0.7rem', height: 24, flexShrink: 0 }}
                  />
                </Box>

                {r.obs && (
                  <Typography variant="caption" color="text.secondary" sx={{
                    mt: 0.5,
                    display: 'block',
                    fontStyle: 'italic',
                    bgcolor: '#f5f5f5',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    wordBreak: 'break-word',
                  }}>
                    {r.obs}
                  </Typography>
                )}
              </Box>
              {index < log.results.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
