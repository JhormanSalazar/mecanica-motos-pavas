import { useEffect, useState, useCallback } from "react";
import {
  fetchChecklistItems,
  saveChecklistItem,
  deleteChecklistItem,
  updateChecklistItemActive,
} from "../api/checklistItemsApi";

export default function useChecklistItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);

  const fetchItems = useCallback(async function () {
    try {
      const data = await fetchChecklistItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
      await saveChecklistItem(editId, form);
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Error al guardar");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este item?")) return;
    try {
      await deleteChecklistItem(id);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  }

  async function toggleActive(item) {
    try {
      await updateChecklistItemActive(item.id, !item.isActive);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar");
    }
  }

  return {
    items,
    loading,
    dialogOpen,
    setDialogOpen,
    form,
    setForm,
    editId,
    handleOpen,
    handleSave,
    handleDelete,
    toggleActive,
  };
}
