import { Box } from "@mui/material";
import WorkLogDetailModal from "../../components/WorkLogDetailModal";
import useWorkLogs from "./hooks/useWorkLogs";
import WorkLogsHeader from "./components/WorkLogsHeader";
import WorkLogsTable from "./components/WorkLogsTable";
import { pageContainerSx } from "./styles/workLogsStyles";

export default function WorkLogsPage() {
  const { logs, loading, selectedLog, handleSelectLog, handleCloseDetail } =
    useWorkLogs();

  return (
    <Box sx={pageContainerSx}>
      <WorkLogsHeader />

      <WorkLogsTable logs={logs} loading={loading} onSelectLog={handleSelectLog} />

      <WorkLogDetailModal log={selectedLog} onClose={handleCloseDetail} />
    </Box>
  );
}
