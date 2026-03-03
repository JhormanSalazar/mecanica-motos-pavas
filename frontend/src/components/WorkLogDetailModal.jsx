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
import { X, User, ClipboardList } from "lucide-react";

export default function WorkLogDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <Dialog 
      open={!!log} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
          <ClipboardList size={22} color="#666" />
          <Typography variant="h6" fontWeight="600" sx={{ color: "#1a1a1a" }}>
            Servicio #{log.id}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={log.type}
            color={log.type === "ALISTAMIENTO" ? "primary" : "warning"}
            size="small"
            sx={{ 
              fontWeight: "semiBold", 
              borderRadius: "6px", 
              textTransform: "uppercase",
              fontSize: "0.7rem",
              px: 1
            }}
          />
          <IconButton onClick={onClose} size="small" sx={{ color: "#999" }}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2, backgroundColor: "#fafafa" }}>
        {/* Sección del Piloto con diseño moderno */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3, 
          p: 2, 
          bgcolor: "white", 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #eee'
        }}>
          <Box sx={{ 
            bgcolor: 'primary.light', 
            p: 1, 
            borderRadius: '50%', 
            display: 'flex', 
            color: 'primary.main' 
          }}>
            <User size={24} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled", textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
              Piloto Responsable
            </Typography>
            <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.2 }}>
              {log.pilot?.name}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: "#666", display: 'flex', alignItems: 'center', gap: 1 }}>
          Checklist de Verificación
        </Typography>

        {log.results?.map((r) => (
          <Box
            key={r.id}
            sx={{
              mb: 1.5,
              p: 2,
              bgcolor: "white",
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateX(4px)' }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight="600" sx={{ color: "#333" }}>
                {r.name}
              </Typography>
              <Chip
                label={r.status}
                size="small"
                variant={r.status === "SI" ? "filled" : "outlined"}
                color={r.status === "SI" ? "success" : "error"}
                sx={{ 
                  fontWeight: 900, 
                  minWidth: 45,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            
            {r.obs && (
              <>
                <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', bgcolor: '#f1f1f1', p: 1, borderRadius: 1 }}>
                  <strong>Observación:</strong> {r.obs}
                </Typography>
              </>
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}