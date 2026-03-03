import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Save, MessageSquare } from "lucide-react";
import api from "../api/axios";

export default function NewService() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px

  const [pilots, setPilots] = useState([]);
  const [, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pilotId, setPilotId] = useState("");
  const [hours, setHours] = useState("");
  const [type, setType] = useState("ALISTAMIENTO");
  const [results, setResults] = useState([]);
  const [expandedObs, setExpandedObs] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [pilotsRes, itemsRes] = await Promise.all([
          api.get("/pilots"),
          api.get("/checklist-items/active"),
        ]);
        setPilots(pilotsRes.data);
        setChecklistItems(itemsRes.data);
        setResults(
          itemsRes.data.map((item) => ({
            itemId: item.id,
            name: item.name,
            status: "",
            obs: "",
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleStatusChange(index, newStatus) {
    setResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });
  }

  function handleObsChange(index, obs) {
    setResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], obs };
      return updated;
    });
  }

  function toggleObservation(index) {
    setExpandedObs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!pilotId || !hours || !type) {
      setError(
        "Selecciona un piloto, ingresa las horas y el tipo de servicio.",
      );
      return;
    }

    const incomplete = results.some((r) => !r.status);
    if (incomplete) {
      setError("Marca SI o NO para todos los ítems del checklist.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/worklogs", {
        pilotId: Number(pilotId),
        hours: Number(hours),
        type,
        results,
      });
      setSuccess("Servicio registrado correctamente.");
      setTimeout(() => navigate("/worklogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el servicio");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Nuevo Servicio
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
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

            <TextField
              label="Horas de Uso"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              fullWidth
              onWheel={(e) => e.target.blur()} // Evitar cambio accidental de valores con scroll
            />

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

        {/* Checklist dinámico */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Checklist de Ítems
            </Typography>

            {results.map((item, index) => (
              <Box key={item.itemId}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontWeight: 500, flexGrow: 1 }}>
                    {item.name}
                  </Typography>

                  {/* Grupo de Controles (Botones + Comentario) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={item.status}
                      onChange={(_e, val) => {
                        if (val !== null) handleStatusChange(index, val);
                      }}
                    >
                      <ToggleButton
                        value="SI"
                        color="success"
                        sx={{ px: 2, fontWeight: "bold" }}
                      >
                        SI
                      </ToggleButton>
                      <ToggleButton
                        value="NO"
                        color="error"
                        sx={{ px: 2, fontWeight: "bold" }}
                      >
                        NO
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <IconButton
                      size="small"
                      onClick={() => toggleObservation(index)}
                      color={expandedObs[index] ? "primary" : "default"}
                      sx={{
                        border: 1,
                        borderColor: expandedObs[index]
                          ? "primary.main"
                          : "divider",
                        borderRadius: 1, // Bordes un poco más rectos para que luzca moderno
                      }}
                    >
                      <MessageSquare size={18} />
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={expandedObs[index]} timeout="auto" unmountOnExit>
                  <Box
                    sx={{ pl: isMobile ? 0 : 3, pr: isMobile ? 0 : 3, pb: 2 }}
                  >
                    <TextField
                      label="Observaciones"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={item.obs}
                      onChange={(e) => handleObsChange(index, e.target.value)}
                      placeholder="Escribe observaciones adicionales..."
                    />
                  </Box>
                </Collapse>

                {index < results.length - 1 && <Divider />}
              </Box>
            ))}

            {results.length === 0 && (
              <Typography color="text.secondary">
                No hay ítems de checklist activos. Crea algunos desde la sección
                "Checklist Items".
              </Typography>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<Save size={20} />}
          disabled={submitting}
          sx={{ px: 4 }}
        >
          {submitting ? "Guardando..." : "Guardar Servicio"}
        </Button>
      </Box>
    </Box>
  );
}
