import { useState, useEffect } from "react";
import { fetchUsersApi, createUserApi, updateUserApi, deleteUserApi } from "../api/usersApi";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "", password: "" });
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function fetchUsers() {
    try {
      const data = await fetchUsersApi();
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

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleEmailChange(value) {
    setForm({ ...form, email: value });
    if (value && !validateEmail(value)) {
      setEmailError("Por favor ingrese un email válido");
    } else {
      setEmailError("");
    }
  }

  function handleOpen(user = null) {
    if (user) {
      setForm({ email: user.email, role: user.role });
      setEditId(user.id);
    } else {
      setForm({ email: "", role: "", password: "" });
      setEditId(null);
    }
    setEmailError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.email || !form.role || (!editId && !form.password)) {
      alert("Por favor complete todos los campos");
      return;
    }
    if (!validateEmail(form.email)) {
      setEmailError("Por favor ingrese un email válido");
      return;
    }
    try {
      if (editId) {
        await updateUserApi(editId, { email: form.email, role: form.role });
      } else {
        await createUserApi(form);
      }
      fetchUsers();
      setDialogOpen(false);
      setForm({ email: "", role: "", password: "" });
      setEditId(null);
      setEmailError("");
    } catch (err) {
      console.error("Error saving user:", err);
      const errorMessage = err.response?.data?.error || "Ocurrió un error al guardar el usuario.";
      alert(errorMessage);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUserApi(id);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMessage = err.response?.data?.error || "Ocurrió un error al eliminar el usuario.";
      alert(errorMessage);
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
    emailError,
    handleEmailChange,
    handleOpen,
    handleSave,
    handleDelete,
  };
}
