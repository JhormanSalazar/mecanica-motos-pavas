import { useEffect, useState } from "react";
import { fetchWorkLogsCompleted } from "../api/workLogsCompletedApi";

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

  const handleSelectLog = (log) => setSelectedLog(log);

  const handleCloseDetail = () => setSelectedLog(null);

  return {
    logs,
    loading,
    selectedLog,
    handleSelectLog,
    handleCloseDetail,
  };
}
