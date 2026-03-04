import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { X, Wrench } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/formatDate";
import WorkLogInfoCards from "./WorkLogInfoCards";
import ChecklistSection from "./ChecklistSection";

export default function WorkLogDetailModal({ log, onClose }) {
  const [systemItemsExpanded, setSystemItemsExpanded] = useState(true);
  const [customItemsExpanded, setCustomItemsExpanded] = useState(true);

  if (!log) return null;

  const systemItems = log.results?.filter((r) => !r.isCustom) || [];
  const customItems = log.results?.filter((r) => r.isCustom) || [];

  return (
    <Dialog open={!!log} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          m: 0,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor:
                log.type === "ALISTAMIENTO" ? "#e3f2fd" : "#fff3e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                log.type === "ALISTAMIENTO" ? "#1976d2" : "#f57c00",
              flexShrink: 0,
            }}
          >
            <Wrench size={16} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body1"
              fontWeight={700}
              lineHeight={1.2}
              noWrap
            >
              Servicio #{log.id}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block" }}
            >
              {formatDate(log.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <Chip
            label={log.type}
            color={log.type === "ALISTAMIENTO" ? "primary" : "warning"}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.65rem", height: 24 }}
          />
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <X size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#fafafa" }}
      >
        <WorkLogInfoCards log={log} />

        <ChecklistSection
          title="Items del Sistema"
          items={systemItems}
          expanded={systemItemsExpanded}
          onToggle={() => setSystemItemsExpanded(!systemItemsExpanded)}
        />

        <ChecklistSection
          title="Items Propios del Servicio"
          items={customItems}
          expanded={customItemsExpanded}
          onToggle={() => setCustomItemsExpanded(!customItemsExpanded)}
        />
      </DialogContent>
    </Dialog>
  );
}
