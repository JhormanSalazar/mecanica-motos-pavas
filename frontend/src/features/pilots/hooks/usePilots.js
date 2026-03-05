import { useEffect, useState } from "react";
import { fetchPilots as apiFetchPilots, savePilot, deletePilot } from "../api/pilotsApi";

const emptyForm = { name: "", bikeType: "", phone: "", email: "" };

export default function usePilots() {
  // Propiedades del estado
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // Funciones para manejar la lógica
  async function fetchPilots() {
    try {
      const data = await apiFetchPilots();
      setPilots(data);
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
      await savePilot(editId, form);
      setDialogOpen(false);
      fetchPilots();
    } catch (err) {
      alert(err.response?.data?.error || "Error al guardar");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este piloto?")) return;
    try {
      await deletePilot(id);
      fetchPilots();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  }

  function handleCloseDialog() {
    setDialogOpen(false);
  }

  function handleFormChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  return {
    pilots,
    loading,
    dialogOpen,
    form,
    editId,
    handleOpen,
    handleSave,
    handleDelete,
    handleCloseDialog,
    handleFormChange,
  };
}
