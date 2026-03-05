import api from "../../../api/axios";

export async function fetchWorkLogsInProgress() {
  const res = await api.get("/worklogs");
  return res.data.filter((log) => log.state === "EN_PROCESO");
}
