import api from "../../../api/axios";

export const fetchWorkLogs = async () => {
  const res = await api.get("/worklogs");
  return res.data;
};
