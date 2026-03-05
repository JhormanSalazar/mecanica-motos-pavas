import api from "../../../api/axios";

export async function fetchWorkLogsPending() {
  const res = await api.get("/worklogs");
  return res.data.filter((log) => log.state === "PENDIENTE");
}
