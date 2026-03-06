import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
  Collapse,
} from "@mui/material";
import { X, User, Clock, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [systemItemsExpanded, setSystemItemsExpanded] = useState(true);
  const [customItemsExpanded, setCustomItemsExpanded] = useState(true);

  if (!log) return null;

  // Separar items del sistema de items propios
  const systemItems = log.results?.filter(r => !r.isCustom) || [];
  const customItems = log.results?.filter(r => r.isCustom) || [];

  const stateConfig = {
    TERMINADO: { label: 'Terminado', bg: '#e8f5e9', color: '#2e7d32' },
    EN_PROCESO: { label: 'En Proceso', bg: '#fff8e1', color: '#f57f17' },
    PENDIENTE: { label: 'Pendiente', bg: '#e3f2fd', color: '#1976d2' },
  };

  const currentState = stateConfig[log.state] || stateConfig.EN_PROCESO;

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
          {/* Estado chip: visible en pantallas sm en adelante */}
          <Chip
            label={currentState.label}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 24,
              bgcolor: currentState.bg,
              color: currentState.color,
              display: { xs: 'none', sm: 'inline-flex' },
            }}
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

          {log.previousHours != null && (
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
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#616161',
                flexShrink: 0,
              }}>
                <Clock size={14} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, fontSize: '0.6rem' }}>
                  H.registradas
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {log.previousHours}h
                </Typography>
              </Box>
            </Box>
          )}

          <Box sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            bgcolor: "white",
            borderRadius: 2,
            border: '1px solid #eee',
            flexShrink: 0,
          }}>
            <Box sx={{
                width: 30,
                height: 30,
                borderRadius: 1.5,
                bgcolor: currentState.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentState.color,
                flexShrink: 0,
              }}>
                <Wrench size={14} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, fontSize: '0.6rem' }}>
                  Estado
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {currentState.label}
                </Typography>
              </Box>
          </Box>
        </Box>

        {/* Checklist sections */}
        {systemItems.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box
              onClick={() => setSystemItemsExpanded(!systemItemsExpanded)}
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                '&:hover': { opacity: 0.7 },
                transition: 'opacity 0.2s',
              }}
            >
              <Typography variant="caption" sx={{
                fontWeight: 700,
                color: "text.secondary",
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Items del Sistema ({systemItems.length})
              </Typography>
              <IconButton size="small">
                {systemItemsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
            </Box>

            <Collapse in={systemItemsExpanded} timeout="auto">
              <Box sx={{
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #eee',
                overflow: 'hidden',
              }}>
                {systemItems.map((r, index) => (
                  <Box key={r.id}>
                    <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                        <Typography 
                          variant="body2" 
                          fontWeight={600} 
                          sx={{ 
                            minWidth: 0, 
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
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
                    {index < systemItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        )}

        {customItems.length > 0 && (
          <Box>
            <Box
              onClick={() => setCustomItemsExpanded(!customItemsExpanded)}
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                '&:hover': { opacity: 0.7 },
                transition: 'opacity 0.2s',
              }}
            >
              <Typography variant="caption" sx={{
                fontWeight: 700,
                color: "text.secondary",
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Items Propios del Servicio ({customItems.length})
              </Typography>
              <IconButton size="small">
                {customItemsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
            </Box>

            <Collapse in={customItemsExpanded} timeout="auto">
              <Box sx={{
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #eee',
                overflow: 'hidden',
              }}>
                {customItems.map((r, index) => (
                  <Box key={r.id}>
                    <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                        <Typography 
                          variant="body2" 
                          fontWeight={600} 
                          sx={{ 
                            minWidth: 0, 
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
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
                    {index < customItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
