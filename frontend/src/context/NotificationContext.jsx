import React, { createContext, useCallback, useState, useRef } from 'react';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const idRef = useRef(1);

  const addToast = useCallback((payload) => {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, ...payload }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(({ type = 'info', title, message, autoClose = 3000, confirmText, cancelText }) => {
    if (type === 'info') {
      const id = addToast({ type, title, message, autoClose });
      if (autoClose) setTimeout(() => removeToast(id), autoClose);
      return Promise.resolve(id);
    }

    // For non-toast types show modal
    if (type === 'confirm') {
      return new Promise((resolve) => {
        setModal({ type, title, message, confirmText, cancelText, resolve });
      });
    }

    // error / success as modal that resolves when closed
    return new Promise((resolve) => {
      setModal({ type, title, message, resolve });
    });
  }, [addToast, removeToast]);

  const closeModal = useCallback((result) => {
    if (modal && typeof modal.resolve === 'function') modal.resolve(result);
    setModal(null);
  }, [modal]);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast, notify, modal, setModal, closeModal }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
