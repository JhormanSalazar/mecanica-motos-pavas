import {
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Collapse,
} from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ChecklistSection({ title, items, expanded, onToggle }) {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        onClick={onToggle}
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          "&:hover": { opacity: 0.7 },
          transition: "opacity 0.2s",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title} ({items.length})
        </Typography>
        <IconButton size="small">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto">
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #eee",
            overflow: "hidden",
          }}
        >
          {items.map((r, index) => (
            <Box key={r.id}>
              <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      minWidth: 0,
                      wordBreak: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.name}
                  </Typography>
                  <Chip
                    label={r.status}
                    size="small"
                    variant={r.status === "SI" ? "filled" : "outlined"}
                    color={r.status === "SI" ? "success" : "error"}
                    sx={{
                      fontWeight: 800,
                      minWidth: 42,
                      fontSize: "0.7rem",
                      height: 24,
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {r.obs && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      display: "block",
                      fontStyle: "italic",
                      bgcolor: "#f5f5f5",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {r.obs}
                  </Typography>
                )}
              </Box>
              {index < items.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
