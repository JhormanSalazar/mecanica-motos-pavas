import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/material";
import { FilePlus, Save, MessageSquare, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import api from "../api/axios";

export default function NewService() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingLog = location.state?.editingLog;
  const isEditMode = !!editingLog;

  const [pilots, setPilots] = useState([]);
  const [, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [terminating, setTerminating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdServiceId, setCreatedServiceId] = useState(isEditMode ? editingLog.id : null);

  const [pilotId, setPilotId] = useState("");
  const [hours, setHours] = useState("");
  const [type, setType] = useState("ALISTAMIENTO");
  const [results, setResults] = useState([]);
  const [expandedObs, setExpandedObs] = useState({});
  const [checklistExpanded, setChecklistExpanded] = useState(true);

  // Estados para items propios
  const [customItems, setCustomItems] = useState([]);
  const [customItemName, setCustomItemName] = useState("");
  const [expandedCustomObs, setExpandedCustomObs] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [pilotsRes, itemsRes] = await Promise.all([
          api.get("/pilots"),
          api.get("/checklist-items/active"),
        ]);
        setPilots(pilotsRes.data);
        setChecklistItems(itemsRes.data);
        
        if (isEditMode) {
          // Cargar datos del servicio a editar
          setPilotId(String(editingLog.pilotId));
          setHours(String(editingLog.hours));
          setType(editingLog.type);
          
          // Separar items del sistema de items propios
          const systemResults = editingLog.results?.filter(r => !r.isCustom) || [];
          const customResults = editingLog.results?.filter(r => r.isCustom) || [];
          
          // Mapear resultados del sistema a items
          const mappedResults = itemsRes.data.map((item) => {
            const existingResult = systemResults.find(r => r.checklistItemId === item.id);
            return {
              itemId: item.id,
              name: item.name,
              status: existingResult?.status || "",
              obs: existingResult?.obs || "",
            };
          });
          setResults(mappedResults);
          
          // Cargar items propios
          setCustomItems(
            customResults.map((r) => ({
              id: r.id,
              name: r.name,
              status: r.status,
              obs: r.obs || "",
              isCustom: true,
            }))
          );
        } else {
          // Modo nuevo servicio
          setResults(
            itemsRes.data.map((item) => ({
              itemId: item.id,
              name: item.name,
              status: "",
              obs: "",
            })),
          );
        }
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

  // Funciones para items propios
  function addCustomItem() {
    if (!customItemName.trim()) return;
    
    const newItem = {
      id: crypto.randomUUID(), // ID temporal único
      name: customItemName.trim(),
      status: "",
      obs: "",
      isCustom: true,
    };
    
    setCustomItems((prev) => [...prev, newItem]);
    setCustomItemName("");
  }

  function removeCustomItem(id) {
    setCustomItems((prev) => prev.filter((item) => item.id !== id));
    setExpandedCustomObs((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  function handleCustomStatusChange(id, newStatus) {
    setCustomItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  }

  function handleCustomObsChange(id, obs) {
    setCustomItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, obs } : item))
    );
  }

  function toggleCustomObservation(id) {
    setExpandedCustomObs((prev) => ({
      ...prev,
      [id]: !prev[id],
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

    // Validar items de checklist solo si es ALISTAMIENTO
    if (type === "ALISTAMIENTO") {
      const incomplete = results.some((r) => !r.status);
      if (incomplete) {
        setError("Marca SI o NO para todos los ítems del checklist.");
        return;
      }
    }

    // Validar items propios
    const incompleteCustom = customItems.some((item) => !item.status);
    if (incompleteCustom) {
      setError("Marca SI o NO para todos los ítems propios.");
      return;
    }

    // Si es REPARACION y no hay items propios
    if (type === "REPARACION" && customItems.length === 0) {
      setError("Debes agregar al menos un ítem propio para una reparación.");
      return;
    }

    setSubmitting(true);
    try {
      // Combinar items de checklist (solo si es ALISTAMIENTO) con items propios
      const allResults = [
        ...(type === "ALISTAMIENTO" ? results : []),
        ...customItems.map((item) => ({
          itemId: item.itemId || null,
          name: item.name,
          status: item.status,
          obs: item.obs || "",
          isCustom: true,
        })),
      ];

      const payload = {
        pilotId: Number(pilotId),
        hours: Number(hours),
        type,
        results: allResults,
      };

      if (isEditMode) {
        // Actualizar servicio existente
        await api.patch(`/worklogs/${createdServiceId}`, {
          hours: Number(hours),
          type,
          results: allResults,
        });
        setSuccess("Servicio actualizado correctamente. Puedes terminar el servicio cuando todos los ítems estén completos.");
      } else {
        // Crear nuevo servicio
        const response = await api.post("/worklogs", payload);
        // Guardar el ID del servicio creado para poder terminarlo después
        setCreatedServiceId(response.data.id);
        setSuccess("Servicio registrado correctamente. Puedes terminarlo cuando todos los ítems estén completos.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el servicio");
    } finally {
      setSubmitting(false);
    }
  }

  // Función para verificar si todos los items están SI
  function allItemsCompleted() {
    // Para ALISTAMIENTO, verifica que todos los checklist items sean SI
    const checklistComplete = type === "ALISTAMIENTO" 
      ? results.every(r => r.status === "SI") 
      : true;
    
    // Para items propios, si hay, todos deben ser SI
    const customComplete = customItems.length > 0 
      ? customItems.every(item => item.status === "SI") 
      : true;
    
    return checklistComplete && customComplete;
  }

  // Función para terminar el servicio
  async function handleTerminateService() {
    if (!createdServiceId) {
      setError("Debes guardar el servicio primero.");
      return;
    }

    if (!allItemsCompleted()) {
      setError("Todos los ítems deben estar marcados como SI para terminar el servicio.");
      return;
    }

    setTerminating(true);
    try {
      await api.patch(`/worklogs/${createdServiceId}/state`, {
        state: "TERMINADO",
      });
      setSuccess("Servicio terminado correctamente.");
      setTimeout(() => navigate("/worklogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al terminar el servicio");
    } finally {
      setTerminating(false);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexShrink: 0 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2, flexShrink: 0,
          bgcolor: 'primary.main', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: 'white',
        }}>
          <FilePlus size={20} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={800} noWrap>{isEditMode ? "Editar Servicio" : "Nuevo Servicio"}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEditMode ? "Actualiza los datos del servicio" : "Completa el formulario de alistamiento o reparacion"}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, flexShrink: 0 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 3, pb: 3 }}>
        <Card>
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
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 0) {
                  setHours(value);
                }
              }}
              required
              fullWidth
              inputProps={{ min: 0 }}
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

        {/* Checklist de items (solo para ALISTAMIENTO) */}
        {type === "ALISTAMIENTO" && (
          <Card>
            <CardContent>
              <Box
                onClick={() => setChecklistExpanded(!checklistExpanded)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  mb: checklistExpanded ? 2 : 0,
                  '&:hover': { opacity: 0.7 },
                  transition: 'opacity 0.2s',
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Checklist de Ítems del Sistema
                </Typography>
                <IconButton size="small">
                  {checklistExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
              </Box>

              <Collapse in={checklistExpanded} timeout="auto">

              {results.map((item, index) => (
                <Box key={item.itemId}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 1,
                      py: 1.5,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "space-between",
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={item.status}
                        onChange={(_e, val) => {
                          if (val !== null) handleStatusChange(index, val);
                        }}
                        sx={{ flexShrink: 0 }}
                      >
                        <ToggleButton
                          value="SI"
                          color="success"
                          sx={{ px: 1.5, fontWeight: "bold", fontSize: '0.8rem' }}
                        >
                          SI
                        </ToggleButton>
                        <ToggleButton
                          value="NO"
                          color="error"
                          sx={{ px: 1.5, fontWeight: "bold", fontSize: '0.8rem' }}
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
                          borderRadius: 1,
                          flexShrink: 0,
                        }}
                      >
                        <MessageSquare size={18} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={expandedObs[index]} timeout="auto" unmountOnExit>
                    <Box sx={{ pb: 2 }}>
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
              </Collapse>
            </CardContent>
          </Card>
        )}

        {/* Items propios (siempre visible) */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Ítems Propios del Servicio
              {type === "REPARACION" && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  (Requerido)
                </Typography>
              )}
            </Typography>

            {/* Formulario para agregar items propios */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: customItems.length > 0 ? 2 : 0,
              }}
            >
              <TextField
                size="small"
                fullWidth
                label="Nombre del ítem"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomItem();
                  }
                }}
                placeholder="Ej: Revisión de motor, Cambio de aceite..."
              />
              <Button
                variant="contained"
                onClick={addCustomItem}
                disabled={!customItemName.trim()}
                sx={{ px: 3, minWidth: "auto" }}
              >
                <Plus size={20} />
              </Button>
            </Box>

            {/* Lista de items propios */}
            {customItems.length > 0 && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                {customItems.map((item, index) => (
                  <Box key={item.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 1,
                        py: 1.5,
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: { xs: "normal", sm: "nowrap" },
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "space-between",
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <ToggleButtonGroup
                          exclusive
                          size="small"
                          value={item.status}
                          onChange={(_e, val) => {
                            if (val !== null) handleCustomStatusChange(item.id, val);
                          }}
                          sx={{ flexShrink: 0 }}
                        >
                          <ToggleButton
                            value="SI"
                            color="success"
                            sx={{ px: 1.5, fontWeight: "bold", fontSize: '0.8rem' }}
                          >
                            SI
                          </ToggleButton>
                          <ToggleButton
                            value="NO"
                            color="error"
                            sx={{ px: 1.5, fontWeight: "bold", fontSize: '0.8rem' }}
                          >
                            NO
                          </ToggleButton>
                        </ToggleButtonGroup>

                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleCustomObservation(item.id)}
                            color={expandedCustomObs[item.id] ? "primary" : "default"}
                            sx={{
                              border: 1,
                              borderColor: expandedCustomObs[item.id]
                                ? "primary.main"
                                : "divider",
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          >
                            <MessageSquare size={18} />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeCustomItem(item.id)}
                            sx={{
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          >
                            <X size={18} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    <Collapse in={expandedCustomObs[item.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ pb: 2 }}>
                        <TextField
                          label="Observaciones"
                          size="small"
                          fullWidth
                          multiline
                          rows={2}
                          value={item.obs}
                          onChange={(e) => handleCustomObsChange(item.id, e.target.value)}
                          placeholder="Escribe observaciones adicionales..."
                        />
                      </Box>
                    </Collapse>

                    {index < customItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            )}

            {customItems.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
                Agrega ítems específicos para este servicio
                {type === "REPARACION" && " (obligatorio para reparaciones)"}.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Botones al final - dentro del form */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" }, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save size={20} />}
            disabled={submitting || terminating}
            sx={{ px: 4, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
          >
            {submitting ? (isEditMode ? "Actualizando..." : "Guardando...") : (isEditMode ? "Actualizar Servicio" : "Guardar Servicio")}
          </Button>

          {(isEditMode || createdServiceId) && (
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<Save size={20} />}
              disabled={!allItemsCompleted() || terminating || submitting}
              onClick={handleTerminateService}
              sx={{ px: 4, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
              title={!allItemsCompleted() ? "Todos los ítems deben estar marcados como SI" : ""}
            >
              {terminating ? "Terminando..." : "Terminar Servicio"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
