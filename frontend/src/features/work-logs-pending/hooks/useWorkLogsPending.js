import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWorkLogsPending } from "../api/workLogsPendingApi";

export default function useWorkLogsPending() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await fetchWorkLogsPending();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching pending logs:", err);
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

  const handleCloseDetail = () => setSelectedLog(null);

  return {
    logs,
    loading,
    selectedLog,
    handleEditService,
    handleSelectLog,
    handleCloseDetail,
  };
}
