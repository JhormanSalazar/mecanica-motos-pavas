import { useState } from "react";
import changePassword from "../api/changePasswordApi";
import useNotifications from "../../../hooks/useNotifications";
import { useAuth } from "../../../context/AuthContext";

export default function useMyConfig() {
  const { user } = useAuth();
  const { success, error } = useNotifications();

  const [actualPassword, setActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (newPassword !== confirmPassword) {
      return error({ title: "Validación", message: "La nueva contraseña y su confirmación no coinciden" });
    }
    if (!user || !user.id) return error({ title: "Error", message: "Usuario no identificado" });

    setSubmitting(true);
    try {
      await changePassword(user.id, actualPassword, newPassword);
      success({ title: "Contraseña", message: "Contraseña actualizada correctamente" });
      setActualPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      const msg = err.response?.data?.error || err.message || "Error al actualizar contraseña";
      error({ title: "Error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    actualPassword,
    setActualPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    submitting,
    handleSubmit,
  };
}
