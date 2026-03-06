import { Card, CardContent, Typography, TextField, MenuItem, Box } from "@mui/material";
import { serviceDataCardContentSx } from "../styles/newServiceStyles";

export default function ServiceDataCard({
  pilots,
  pilotId,
  setPilotId,
  hours,
  setHours,
  type,
  setType,
  previousHours,
}) {
  return (
    <Card>
      <CardContent sx={serviceDataCardContentSx}>
        <Typography variant="subtitle1" fontWeight="bold">
          Datos del servicio
        </Typography>

        <TextField
          select
          label="Piloto"
          value={pilotId}
          onChange={(e) => setPilotId(e.target.value)}
          required
          fullWidth
        >
          {pilots.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} — {p.bikeType}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          {previousHours != null && (
            <TextField
              label="Horas registradas"
              value={previousHours}
              disabled
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ flex: { xs: '1 1 100%', sm: '0 0 40%' } }}
            />
          )}

          <TextField
            label="Horas de Uso"
            type="number"
            value={hours}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                setHours(value);
              }
            }}
            required
            fullWidth
            inputProps={{ min: 0 }}
            onWheel={(e) => e.target.blur()}
            sx={{ flex: previousHours != null ? { xs: '1 1 100%', sm: '0 0 60%' } : '1 1 100%' }}
          />
        </Box>

        <TextField
          select
          label="Tipo de Servicio"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          fullWidth
        >
          <MenuItem value="ALISTAMIENTO">Alistamiento</MenuItem>
          <MenuItem value="REPARACION">Reparación</MenuItem>
        </TextField>
      </CardContent>
    </Card>
  );
}
