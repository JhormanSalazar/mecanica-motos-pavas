import api from "../../../api/axios";

export async function fetchChecklistItems() {
  const res = await api.get("/checklist-items");
  return res.data;
}

export async function saveChecklistItem(id, data) {
  if (id) {
    return api.put(`/checklist-items/${id}`, data);
  }
  return api.post("/checklist-items", data);
}

export async function deleteChecklistItem(id) {
  return api.delete(`/checklist-items/${id}`);
}

export async function updateChecklistItemActive(id, isActive) {
  return api.put(`/checklist-items/${id}`, { isActive });
}
