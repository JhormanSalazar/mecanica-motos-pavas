import { Box } from "@mui/material";
import WorkLogDetailModal from "../../components/WorkLogDetailModal";
import useWorkLogsPending from "./hooks/useWorkLogsPending";
import WorkLogsPendingHeader from "./components/WorkLogsPendingHeader";
import WorkLogsPendingTable from "./components/WorkLogsPendingTable";
import { containerSx } from "./styles/workLogsPendingStyles";

export default function WorkLogsPendingPage() {
  const {
    logs,
    loading,
    selectedLog,
    handleEditService,
    handleSelectLog,
    handleCloseDetail,
  } = useWorkLogsPending();

  return (
    <Box sx={containerSx}>
      <WorkLogsPendingHeader />

      <WorkLogsPendingTable
        logs={logs}
        loading={loading}
        onSelectLog={handleSelectLog}
        onEditService={handleEditService}
      />

      <WorkLogDetailModal log={selectedLog} onClose={handleCloseDetail} />
    </Box>
  );
}
