import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import "../styles/notification.css";
import { Info, CheckCircle, XCircle, HelpCircle } from "lucide-react";

// Diccionario de iconos para reutilizar en Toast y Modal
const ICONS = {
  info: Info,
  success: CheckCircle,
  error: XCircle,
  confirm: HelpCircle,
};

export default function NotificationModal() {
  const { toasts, removeToast, modal, closeModal } =
    useContext(NotificationContext);

  return (
    <>
      {/* Toast Wrapper (Mantenemos la lógica de Toasts) */}
      <div className="nm-toast-wrapper" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div key={t.id} className={`nm-toast nm-${t.type}`}>
              <div className="nm-toast-icon-wrapper">
                <Icon className="nm-toast-icon" />
              </div>
              <div className="nm-toast-content">
                {t.title && <div className="nm-toast-title">{t.title}</div>}
                <div className="nm-toast-message">{t.message}</div>
              </div>
              <button
                className="nm-toast-close"
                onClick={() => removeToast(t.id)}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Modern Modal */}
      {modal && (
        <div className="nm-overlay">
          <div
            className={`nm-modal nm-${modal.type}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="nm-modal-header">
              <div className="nm-modal-icon-wrapper">
                {(() => {
                  const MIcon = ICONS[modal.type] || Info;
                  return <MIcon className="nm-modal-icon" strokeWidth={2.5} />;
                })()}
              </div>
              {modal.title && <h3 className="nm-modal-title">{modal.title}</h3>}
            </div>

            <div className="nm-modal-body">{modal.message}</div>

            <div className="nm-modal-actions">
              {modal.type === "confirm" ? (
                <>
                  <button
                    className="nm-btn nm-btn-cancel"
                    onClick={() => closeModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="nm-btn nm-btn-confirm"
                    onClick={() => closeModal(true)}
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  className="nm-btn nm-btn-ok"
                  onClick={() => closeModal(true)}
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
