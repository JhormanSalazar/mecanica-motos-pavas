import api from "../../../api/axios";

export async function fetchWorkLogsCompleted() {
  const res = await api.get("/worklogs");
  return res.data.filter((log) => log.state === "TERMINADO");
}

export async function sendCompletionEmail(id) {
  const res = await api.post(`/worklogs/${id}/send-email`);
  return res.data;
}

export async function downloadWorklogPDF(id) {
  const res = await api.get(`/worklogs/${id}/pdf`, {
    responseType: 'blob',
  });
  
  // Crear un blob y descargar el archivo
  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `informe-servicio-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
