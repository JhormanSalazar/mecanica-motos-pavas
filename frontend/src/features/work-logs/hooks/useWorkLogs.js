import { useEffect, useState } from "react";
import { fetchWorkLogs } from "../api/workLogsApi";

export default function useWorkLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchWorkLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLog = (log) => {
    setSelectedLog(log);
  };

  const handleCloseDetail = () => {
    setSelectedLog(null);
  };

  return {
    logs,
    loading,
    selectedLog,
    handleSelectLog,
    handleCloseDetail,
  };
}
