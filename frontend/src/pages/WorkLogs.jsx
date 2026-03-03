import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
} from "@mui/material";
import { FileText, Eye } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import WorkLogDetailModal from "../components/WorkLogDetailModal";
import api from "../api/axios";

export default function WorkLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null); // Para el modal de detalle

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/worklogs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "pilot",
      headerName: "Piloto",
      flex: 1,
      renderCell: (params) => {
        return params.row.pilot?.name || "Sin Asignar";
      },
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
      headerName: "Fecha",
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          startIcon={<Eye size={18} />}
          variant="contained"
          size="small"
          onClick={() => setSelectedLog(params.row)}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Ver Detalle
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        fontWeight="600"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <FileText /> Historial de Servicios
      </Typography>

      <Card sx={{ height: 500, width: "100%", boxShadow: 3, borderRadius: 3 }}>
        <DataGrid
          rows={logs}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </Card>

     {/* Uso del componente independiente */}
      <WorkLogDetailModal 
        log={selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />
    </Box>
  );
}
