import api from "../../../api/axios";

export async function fetchPilots() {
  const res = await api.get("/pilots");
  return res.data;
}

export async function savePilot(id, data) {
  if (id) {
    return api.put(`/pilots/${id}`, data);
  }
  return api.post("/pilots", data);
}

export async function deletePilot(id) {
  return api.delete(`/pilots/${id}`);
}
