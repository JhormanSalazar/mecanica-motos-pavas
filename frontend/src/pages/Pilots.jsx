import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Card,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import ResponsiveButton from "../components/ResponsiveButton";
import api from "../api/axios";

const emptyForm = { name: "", bikeType: "", phone: "", email: "" };

export default function Pilots() {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  async function fetchPilots() {
    try {
      const res = await api.get("/pilots");
      setPilots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPilots();
  }, []);

  function handleOpen(pilot = null) {
    if (pilot) {
      setForm({
        name: pilot.name,
        bikeType: pilot.bikeType,
        phone: pilot.phone || "",
        email: pilot.email || "",
      });
      setEditId(pilot.id);
    } else {
      setForm(emptyForm);
      setEditId(null);
    }
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      if (editId) {
        await api.put(`/pilots/${editId}`, form);
      } else {
        await api.post("/pilots", form);
      }
      setDialogOpen(false);
      fetchPilots();
    } catch (err) {
      alert(err.response?.data?.error || "Error al guardar");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este piloto?")) return;
    try {
      await api.delete(`/pilots/${id}`);
      fetchPilots();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  }

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 150 },
    { field: "bikeType", headerName: "Moto", flex: 1, minWidth: 130 },
    {
      field: "phone",
      headerName: "Telefono",
      width: 140,
      renderCell: (params) => params.value || "-",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => params.value || "-",
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Aseguramos que los iconos estén centrados verticalmente
            height: "100%", // Aseguramos que el contenedor ocupe toda la altura de la celda
            gap: 0.5,
          }}
        >
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpen(params.row)}>
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              flexShrink: 0,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Users size={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800} noWrap>
              Pilotos
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{
              display: { xs: 'none', sm: 'block'}
            }}>
              Gestiona los pilotos
            </Typography>
          </Box>
        </Box>
        <ResponsiveButton
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpen()}
        >
          Nuevo Piloto
        </ResponsiveButton>
      </Box>

      <Card sx={{ width: "100%" }}>
        <Box sx={{ overflowX: "auto" }}>
          <DataGrid
            rows={pilots}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            localeText={{
              noRowsLabel: "No hay pilotos registrados.",
              MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
            }}
          />
        </Box>
      </Card>

      {/* Dialog para crear/editar */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editId ? "Editar Piloto" : "Nuevo Piloto"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Tipo de Moto"
            value={form.bikeType}
            onChange={(e) => setForm({ ...form, bikeType: e.target.value })}
            required
          />
          <TextField
            label="Telefono"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
