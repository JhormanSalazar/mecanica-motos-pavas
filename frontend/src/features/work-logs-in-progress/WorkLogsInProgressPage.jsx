import { Box } from "@mui/material";
import WorkLogDetailModal from "../../components/WorkLogDetailModal";
import useWorkLogsInProgress from "./hooks/useWorkLogsInProgress";
import WorkLogsInProgressHeader from "./components/WorkLogsInProgressHeader";
import WorkLogsInProgressTable from "./components/WorkLogsInProgressTable";
import { containerSx } from "./styles/workLogsInProgressStyles";

export default function WorkLogsInProgressPage() {
  const {
    logs,
    loading,
    selectedLog,
    handleEditService,
    handleSelectLog,
    handleCloseDetail,
  } = useWorkLogsInProgress();

  return (
    <Box sx={containerSx}>
      <WorkLogsInProgressHeader />

      <WorkLogsInProgressTable
        logs={logs}
        loading={loading}
        onSelectLog={handleSelectLog}
        onEditService={handleEditService}
      />

      <WorkLogDetailModal log={selectedLog} onClose={handleCloseDetail} />
    </Box>
  );
}
