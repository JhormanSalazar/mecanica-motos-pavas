import { Box } from "@mui/material";
import useWorkLogs from "./hooks/useWorkLogs";
import WorkLogsHeader from "./components/WorkLogsHeader";
import WorkLogsTable from "./components/WorkLogsTable";
import WorkLogDetailModal from "./components/WorkLogDetailModal";

export default function WorkLogsPage() {
  const {
    logs,
    loading,
    selectedLog,
    handleEditService,
    handleSelectLog,
    handleCloseDetail,
  } = useWorkLogs();

  return (
    <Box sx={{ width: "100%" }}>
      <WorkLogsHeader />

      <WorkLogsTable
        logs={logs}
        loading={loading}
        onViewDetail={handleSelectLog}
        onEditService={handleEditService}
      />

      <WorkLogDetailModal log={selectedLog} onClose={handleCloseDetail} />
    </Box>
  );
}
