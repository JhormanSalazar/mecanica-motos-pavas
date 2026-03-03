import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';

export default function ChecklistItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);

  async function fetchItems() {
    try {
      const res = await api.get('/checklist-items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  function handleOpen(item = null) {
    if (item) {
      setForm({ name: item.name });
      setEditId(item.id);
    } else {
      setForm({ name: '' });
      setEditId(null);
    }
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      if (editId) {
        await api.put(`/checklist-items/${editId}`, form);
      } else {
        await api.post('/checklist-items', form);
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este item?')) return;
    try {
      await api.delete(`/checklist-items/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  }

  async function toggleActive(item) {
    try {
      await api.put(`/checklist-items/${item.id}`, { isActive: !item.isActive });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar');
    }
  }

  if (loading) {
    return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Checklist Items</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpen()}>
          Nuevo Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Chip
                    label={item.isActive ? 'Activo' : 'Inactivo'}
                    color={item.isActive ? 'success' : 'default'}
                    size="small"
                    onClick={() => toggleActive(item)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(item)}><Pencil size={16} /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No hay items registrados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Editar Item' : 'Nuevo Item'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
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
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
