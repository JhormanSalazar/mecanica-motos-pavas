import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  IconButton,
  Typography,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import ResponsiveButton from "../components/ResponsiveButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "", password: "" });
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function fetchUsers() {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorMessage = err.response?.data?.error || "Error al cargar los usuarios.";
      alert(errorMessage);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleOpen(user = null) {
    if (user) {
      setForm({ email: user.email, role: user.role });
      setEditId(user.id);
    } else {
      setForm({ email: "", role: "", password: "" });
      setEditId(null);
    }
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      const method = editId ? "put" : "post";
      const url = editId ? `/users/${editId}` : "/users";
      
      // No enviar la contraseña al editar
      const payload = editId 
        ? { email: form.email, role: form.role } 
        : form;
      
      await api[method](url, payload);
      fetchUsers();
      setDialogOpen(false);
      setForm({ email: "", role: "", password: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving user:", err);
      const errorMessage = err.response?.data?.error || "Ocurrió un error al guardar el usuario.";
      alert(errorMessage);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMessage = err.response?.data?.error || "Ocurrió un error al eliminar el usuario.";
      alert(errorMessage);
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "role", headerName: "Rol", width: 140 },
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
            alignItems: "center",
            height: "100%",
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
              Usuarios
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Administra los usuarios del sistema
            </Typography>
          </Box>
        </Box>
        <ResponsiveButton
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpen()}
        >
          Nuevo Usuario
        </ResponsiveButton>
      </Box>

      <Card sx={{ width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          localeText={{
            noRowsLabel: "No hay usuarios registrados.",
            MuiTablePagination: { labelRowsPerPage: "Filas por página:" },
          }}
        />
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editId ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            sx={{ mb: 2, mt: 1 }}
            disabled={!!editId} // Disable email field when editing
          />
          <Select
            fullWidth
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            displayEmpty
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Seleccione un rol</MenuItem>
            <MenuItem value="MECHANIC">Mecánico</MenuItem>
            <MenuItem value="ADMIN">Administrador</MenuItem>
          </Select>
          {!editId && ( // Only show password field when creating a new user
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
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