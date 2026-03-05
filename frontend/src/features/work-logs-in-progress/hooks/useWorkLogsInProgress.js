import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWorkLogsInProgress } from "../api/workLogsInProgressApi";

export default function useWorkLogsInProgress() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await fetchWorkLogsInProgress();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (log) => {
    navigate("/new-service", { state: { editingLog: log } });
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
    handleEditService,
    handleSelectLog,
    handleCloseDetail,
  };
}
