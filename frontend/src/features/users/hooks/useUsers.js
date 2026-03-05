import { useState, useEffect } from "react";
import { fetchUsersApi, createUserApi, updateUserApi, deleteUserApi } from "../api/usersApi";
import useNotifications from "../../../hooks/useNotifications";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "", password: "" });
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { success, error, confirm: confirmNotify } = useNotifications();

  async function fetchUsers() {
    try {
      const data = await fetchUsersApi();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorMessage = err.response?.data?.error || "Error al cargar los usuarios.";
      error({ title: "Error al cargar usuarios", message: errorMessage });
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleEmailChange(value) {
    setForm({ ...form, email: value });
  }

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
    if (!form.email || !form.role || (!editId && !form.password)) {
      error({ title: "Validación", message: "Por favor complete todos los campos" });
      return;
    }
    // Rely on HTML5 form validation for email format (type="email" and required)
    try {
      if (editId) {
        await updateUserApi(editId, { email: form.email, role: form.role });
      } else {
        await createUserApi(form);
      }
      await fetchUsers();
      setDialogOpen(false);
      setForm({ email: "", role: "", password: "" });
      setEditId(null);
      success({ title: "Usuario guardado", message: editId ? "Usuario actualizado correctamente" : "Usuario creado correctamente" });
    } catch (err) {
      console.error("Error saving user:", err);
      const errorMessage = err.response?.data?.error || "Ocurrió un error al guardar el usuario.";
      error({ title: "Error al guardar usuario", message: errorMessage });
    }
  }

  async function handleDelete(id) {
    let confirmed = false;
    try {
      const res = await confirmNotify({ title: "Confirmar eliminación", message: "¿Eliminar este usuario?" });
      if (typeof res === "boolean") confirmed = res;
      else confirmed = window.confirm("¿Eliminar este usuario?");
    } catch (e) {
      confirmed = window.confirm("¿Eliminar este usuario?");
    }
    if (!confirmed) return;
    try {
      await deleteUserApi(id);
      await fetchUsers();
      success({ title: "Usuario eliminado", message: "El usuario fue eliminado correctamente" });
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMessage = err.response?.data?.error || "Ocurrió un error al eliminar el usuario.";
      error({ title: "Error al eliminar usuario", message: errorMessage });
    }
  }

  return {
    users,
    dialogOpen,
    setDialogOpen,
    form,
    setForm,
    editId,
    showPassword,
    setShowPassword,
    handleEmailChange,
    handleOpen,
    handleSave,
    handleDelete,
  };
}
