import api from "../../../api/axios";

export async function fetchPilotsAndChecklistItems() {
  const [pilotsRes, itemsRes] = await Promise.all([
    api.get("/pilots"),
    api.get("/checklist-items/active"),
  ]);
  return { pilots: pilotsRes.data, checklistItems: itemsRes.data };
}

export async function createWorklog(payload) {
  return api.post("/worklogs", payload);
}

export async function fetchWorklogsByPilot(pilotId) {
  return api.get(`/worklogs/pilot/${pilotId}`);
}

export async function updateWorklog(id, data) {
  return api.patch(`/worklogs/${id}`, data);
}

export async function terminateWorklog(id) {
  return api.patch(`/worklogs/${id}/state`, { state: "TERMINADO" });
}

export async function sendCompletionEmail(id) {
  return api.post(`/worklogs/${id}/send-email`);
}
