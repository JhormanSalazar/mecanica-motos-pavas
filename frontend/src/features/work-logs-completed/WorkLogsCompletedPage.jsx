import { Box } from "@mui/material";
import WorkLogDetailModal from "../../components/WorkLogDetailModal";
import useWorkLogsCompleted from "./hooks/useWorkLogsCompleted";
import WorkLogsCompletedHeader from "./components/WorkLogsCompletedHeader";
import WorkLogsCompletedTable from "./components/WorkLogsCompletedTable";
import { containerSx } from "./styles/workLogsCompletedStyles";

export default function WorkLogsCompletedPage() {
  const {
    logs,
    loading,
    selectedLog,
    handleSelectLog,
    handleCloseDetail,
    handleSendEmail,
    handleGeneratePDF,
  } = useWorkLogsCompleted();

  return (
    <Box sx={containerSx}>
      <WorkLogsCompletedHeader />

      <WorkLogsCompletedTable
        logs={logs}
        loading={loading}
        onSelectLog={handleSelectLog}
        onSendEmail={handleSendEmail}
        onGeneratePDF={handleGeneratePDF}
      />

      <WorkLogDetailModal log={selectedLog} onClose={handleCloseDetail} />
    </Box>
  );
}
