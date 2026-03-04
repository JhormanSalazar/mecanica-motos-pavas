import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Card,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ResponsiveButton from "../components/ResponsiveButton";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import api from "../api/axios";

export default function ChecklistItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);

  async function fetchItems() {
    try {
      const res = await api.get("/checklist-items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function handleOpen(item = null) {
    if (item) {
      setForm({ name: item.name });
      setEditId(item.id);
    } else {
      setForm({ name: "" });
      setEditId(null);
    }
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      if (editId) {
        await api.put(`/checklist-items/${editId}`, form);
      } else {
        await api.post("/checklist-items", form);
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Error al guardar");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este item?")) return;
    try {
      await api.delete(`/checklist-items/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  }

  async function toggleActive(item) {
    try {
      await api.put(`/checklist-items/${item.id}`, {
        isActive: !item.isActive,
      });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar");
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 200 },
    {
      field: "isActive",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Activo" : "Inactivo"}
          color={params.value ? "success" : "default"}
          size="small"
          onClick={() => toggleActive(params.row)}
          sx={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Aseguramos que los iconos estén centrados verticalmente
            height: "100%", // Aseguramos que el contenedor ocupe toda la altura de la celda
            gap: 0.5,
          }}>
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
            <ClipboardList size={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800} noWrap>
              Items de Checklist
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Administra los items disponibles
            </Typography>
          </Box>
        </Box>
        <ResponsiveButton
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpen()}
        >
          Nuevo Item
        </ResponsiveButton>
      </Box>

      <Card sx={{ width: "100%" }}>
        <Box sx={{ overflowX: "auto" }}>
          <DataGrid
            rows={items}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            localeText={{
              noRowsLabel: "No hay items registrados.",
              MuiTablePagination: { labelRowsPerPage: "Filas por pagina:" },
            }}
          />
        </Box>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editId ? "Editar Item" : "Nuevo Item"}</DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          <TextField
            fullWidth
            label="Nombre del item"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
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
