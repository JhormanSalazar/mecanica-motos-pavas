import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export default function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );

  const { notify } = ctx;

  return {
    info: ({ title, message, autoClose } = {}) =>
      notify({ type: "info", title, message, autoClose }),
    success: ({ title, message } = {}) =>
      notify({ type: "success", title, message }),
    error: ({ title, message } = {}) =>
      notify({ type: "error", title, message }),
    confirm: ({ title, message, confirmText, cancelText } = {}) =>
      notify({ type: "confirm", title, message, confirmText, cancelText }),
    // expose raw notify in case caller needs custom types
    notify,
  };
}
