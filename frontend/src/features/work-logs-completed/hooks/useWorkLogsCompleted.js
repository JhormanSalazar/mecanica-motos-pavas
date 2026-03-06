import { useEffect, useState } from "react";
import { fetchWorkLogsCompleted, sendCompletionEmail, downloadWorklogPDF } from "../api/workLogsCompletedApi";
import useNotifications from "../../../hooks/useNotifications";

export default function useWorkLogsCompleted() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await fetchWorkLogsCompleted();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching completed logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const { confirm, success: notifySuccess, error: notifyError } = useNotifications();

  const handleSendEmail = async (log) => {
    const ok = await confirm({ 
      title: 'Confirmar', 
      message: '¿Desea enviarle un correo al piloto indicando que el servicio de su moto termino?',
      confirmText: 'Enviar',
      cancelText: 'No enviar'
    });
    if (!ok) return;
    try {
      await sendCompletionEmail(log.id);
      notifySuccess({ message: 'Correo enviado correctamente.' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al enviar correo';
      notifyError({ message: msg });
    }
  };

  const handleGeneratePDF = async (log) => {
    const ok = await confirm({ 
      title: 'Generar Informe (PDF)', 
      message: '¿Desea generar un informe (PDF) del servicio? El informe incluirá toda la información del servicio: tipo, horas, fecha, trabajos realizados y observaciones.',
      confirmText: 'Generar',
      cancelText: 'No generar'
    });
    if (!ok) return;
    
    try {
      await downloadWorklogPDF(log.id);
      notifySuccess({ message: 'PDF generado correctamente.' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al generar PDF';
      notifyError({ message: msg });
    }
  };

  const handleSelectLog = (log) => setSelectedLog(log);

  const handleCloseDetail = () => setSelectedLog(null);

  return {
    logs,
    loading,
    selectedLog,
    handleSelectLog,
    handleCloseDetail,
    handleSendEmail,
    handleGeneratePDF,
  };
}
