import api from "../../../api/axios";

export async function fetchWorkLogsCompleted() {
  const res = await api.get("/worklogs");
  return res.data.filter((log) => log.state === "TERMINADO");
}
