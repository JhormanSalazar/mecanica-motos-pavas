import { useEffect, useState, useCallback } from "react";
import {
  fetchChecklistItems,
  saveChecklistItem,
  deleteChecklistItem,
  updateChecklistItemActive,
} from "../api/checklistItemsApi";
import useNotifications from "../../../hooks/useNotifications";

export default function useChecklistItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);
  const { success, error, confirm: confirmNotify } = useNotifications();

  const fetchItems = useCallback(async function () {
    try {
      const data = await fetchChecklistItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      error({ title: "Error al cargar items", message: err.response?.data?.error || "No se pudieron cargar los items" });
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
      await fetchItems();
      success({ title: "Item guardado", message: editId ? "Item actualizado correctamente" : "Item creado correctamente" });
    } catch (err) {
      error({ title: "Error al guardar", message: err.response?.data?.error || "Error al guardar" });
    }
  }

  async function handleDelete(id) {
    let confirmed = false;
    try {
      const res = await confirmNotify({ title: "Confirmar eliminación", message: "¿Eliminar este item?" });
      if (typeof res === "boolean") confirmed = res;
      else confirmed = window.confirm("¿Eliminar este item?");
    } catch (e) {
      confirmed = window.confirm("¿Eliminar este item?");
    }
    if (!confirmed) return;
    try {
      await deleteChecklistItem(id);
      await fetchItems();
      success({ title: "Item eliminado", message: "El item fue eliminado correctamente" });
    } catch (err) {
      error({ title: "Error al eliminar", message: err.response?.data?.error || "Error al eliminar" });
    }
  }

  async function toggleActive(item) {
    try {
      await updateChecklistItemActive(item.id, !item.isActive);
      await fetchItems();
      success({ title: "Item actualizado", message: "Estado actualizado correctamente" });
    } catch (err) {
      error({ title: "Error al actualizar", message: err.response?.data?.error || "Error al actualizar" });
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
