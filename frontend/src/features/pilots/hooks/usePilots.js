import { useEffect, useState } from "react";
import { fetchPilots as apiFetchPilots, savePilot, deletePilot } from "../api/pilotsApi";
import useNotifications from "../../../hooks/useNotifications";

const emptyForm = { name: "", bikeType: "", phone: "", email: "" };

export default function usePilots() {
  // Propiedades del estado
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const { success, error, confirm: confirmNotify } = useNotifications();

  // Funciones para manejar la lógica
  async function fetchPilots() {
    try {
      const data = await apiFetchPilots();
      setPilots(data);
    } catch (err) {
      console.error(err);
      error({
        title: "Error al cargar pilotos",
        message: err.response?.data?.error || "No se pudieron cargar los pilotos",
      });
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
      await fetchPilots();
      success({
        title: "Piloto guardado",
        message: editId ? "Piloto actualizado correctamente" : "Piloto creado correctamente",
      });
    } catch (err) {
      error({
        title: "Error al guardar",
        message: err.response?.data?.error || "Error al guardar",
      });
    }
  }

  async function handleDelete(id) {
    let confirmed = false;
    try {
      const res = await confirmNotify({
        title: "Confirmar eliminación",
        message: "¿Eliminar este piloto?",
      });
      if (typeof res === "boolean") confirmed = res;
      else confirmed = window.confirm("¿Eliminar este piloto?");
    } catch (e) {
      confirmed = window.confirm("¿Eliminar este piloto?");
    }
    if (!confirmed) return;
    try {
      await deletePilot(id);
      await fetchPilots();
      success({ title: "Piloto eliminado", message: "El piloto fue eliminado correctamente" });
    } catch (err) {
      error({
        title: "Error al eliminar",
        message: err.response?.data?.error || "Error al eliminar",
      });
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
