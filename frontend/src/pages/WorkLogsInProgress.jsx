import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Chip, Card } from "@mui/material";
import { Clock, Eye, Edit } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import WorkLogDetailModal from "../components/WorkLogDetailModal";
import api from "../api/axios";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WorkLogsInProgress() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/worklogs");
      setLogs(res.data.filter((log) => log.state === "EN_PROCESO"));
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (log) => {
    navigate("/new-service", { state: { editingLog: log } });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "pilot",
      headerName: "Piloto",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.pilot?.name || "Sin Asignar",
    },
    {
      field: "type",
      headerName: "Tipo",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ALISTAMIENTO" ? "primary" : "warning"}
          size="small"
          variant="outlined"
        />
      ),
    },
    { field: "hours", headerName: "Horas", width: 100 },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 200,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "updatedAt",
      headerName: "Fecha Actualizacion",
      width: 200,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: 0.5,
          }}
        >
          <Button
            startIcon={<Eye size={16} />}
            variant="outlined"
            size="small"
            onClick={() => setSelectedLog(params.row)}
          >
            Ver Detalle
          </Button>
          <Button
            startIcon={<Edit size={16} />}
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEditService(params.row)}
          >
            Editar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Section Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            flexShrink: 0,
            bgcolor: "#f57f17",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Clock size={20} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={800} noWrap>
            Servicios en Proceso
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Servicios de mantenimiento pendientes de finalizar
          </Typography>
        </Box>
      </Box>

      <Card sx={{ width: "100%" }}>
        <Box sx={{ overflowX: "auto" }}>
          <DataGrid
            rows={logs}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            localeText={{
              noRowsLabel: "No hay servicios en proceso.",
              MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
            }}
          />
        </Box>
      </Card>

      <WorkLogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </Box>
  );
}
