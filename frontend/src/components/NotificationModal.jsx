import React from 'react';
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import '../styles/notification.css';

function Toast({ t, onClose }) {
  return (
    <div className={`nm-toast nm-${t.type}`}>
      {t.title && <div className="nm-toast-title">{t.title}</div>}
      <div className="nm-toast-message">{t.message}</div>
      <button className="nm-toast-close" onClick={() => onClose(t.id)}>×</button>
    </div>
  );
}

export default function NotificationModal() {
  const { toasts, removeToast, modal, closeModal } = useContext(NotificationContext);

  return (
    <>
      <div className="nm-toast-wrapper" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} t={t} onClose={removeToast} />
        ))}
      </div>

      {modal && (
        <div className="nm-overlay">
          <div className={`nm-modal nm-${modal.type}`} role="dialog" aria-modal="true">
            {modal.title && <h3 className="nm-modal-title">{modal.title}</h3>}
            <div className="nm-modal-body">{modal.message}</div>
            <div className="nm-modal-actions">
              {modal.type === 'confirm' && (
                <>
                  <button className="nm-btn nm-btn-cancel" onClick={() => closeModal(false)}>Cancelar</button>
                  <button className="nm-btn nm-btn-confirm" onClick={() => closeModal(true)}>Confirmar</button>
                </>
              )}

              {modal.type !== 'confirm' && (
                <button className="nm-btn nm-btn-ok" onClick={() => closeModal(true)}>OK</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
