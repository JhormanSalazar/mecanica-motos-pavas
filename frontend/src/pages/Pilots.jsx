import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';

const emptyForm = { name: '', bikeType: '', phone: '', email: '' };

export default function Pilots() {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  async function fetchPilots() {
    try {
      const res = await api.get('/pilots');
      setPilots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPilots(); }, []);

  function handleOpen(pilot = null) {
    if (pilot) {
      setForm({ name: pilot.name, bikeType: pilot.bikeType, phone: pilot.phone || '', email: pilot.email || '' });
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
        await api.post('/pilots', form);
      }
      setDialogOpen(false);
      fetchPilots();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este piloto?')) return;
    try {
      await api.delete(`/pilots/${id}`);
      fetchPilots();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  }

  if (loading) {
    return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Pilotos</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpen()}>
          Nuevo Piloto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Moto</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pilots.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.bikeType}</TableCell>
                <TableCell>{p.phone || '-'}</TableCell>
                <TableCell>{p.email || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(p)}><Pencil size={16} /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {pilots.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay pilotos registrados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Editar Piloto' : 'Nuevo Piloto'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Tipo de Moto" value={form.bikeType} onChange={(e) => setForm({ ...form, bikeType: e.target.value })} required />
          <TextField label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
