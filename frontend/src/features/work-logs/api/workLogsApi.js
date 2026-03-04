import api from "../../../api/axios";

export async function fetchWorkLogs() {
  const res = await api.get("/worklogs");
  return res.data;
}
