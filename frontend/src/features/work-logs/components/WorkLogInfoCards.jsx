import { Box, Typography } from "@mui/material";
import { User, Clock, Wrench } from "lucide-react";

function InfoCard({ icon: Icon, label, value, iconBgColor, iconColor }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        bgcolor: "white",
        borderRadius: 2,
        border: "1px solid #eee",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.5,
          bgcolor: iconBgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          flexShrink: 0,
        }}
      >
        <Icon size={14} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: 0.5,
            fontSize: "0.6rem",
          }}
        >
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700} noWrap>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function WorkLogInfoCards({ log }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
        mb: 2,
        mt: 1,
      }}
    >
      <InfoCard
        icon={User}
        label="Piloto"
        value={log.pilot?.name || "Sin asignar"}
        iconBgColor="#e3f2fd"
        iconColor="#1976d2"
      />
      <InfoCard
        icon={Clock}
        label="Horas"
        value={`${log.hours}h`}
        iconBgColor="#fff3e0"
        iconColor="#f57c00"
      />
      <InfoCard
        icon={Wrench}
        label="Estado"
        value={log.state === "TERMINADO" ? "Terminado" : "En Proceso"}
        iconBgColor={log.state === "TERMINADO" ? "#e8f5e9" : "#fff8e1"}
        iconColor={log.state === "TERMINADO" ? "#2e7d32" : "#f57f17"}
      />
    </Box>
  );
}
