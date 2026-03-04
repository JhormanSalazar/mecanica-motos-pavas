import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWorkLogs } from "../api/workLogsApi";

export default function useWorkLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = useCallback(async () => {
    try {
      const data = await fetchWorkLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleEditService = useCallback(
    (log) => {
      navigate("/new-service", { state: { editingLog: log } });
    },
    [navigate]
  );

  const handleSelectLog = useCallback((log) => {
    setSelectedLog(log);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedLog(null);
  }, []);

  return {
    logs,
    loading,
    selectedLog,
    handleEditService,
    handleSelectLog,
    handleCloseDetail,
  };
}
