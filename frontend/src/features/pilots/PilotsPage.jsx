import { Box, CircularProgress } from "@mui/material";
import usePilots from "./hooks/usePilots";
import PilotsHeader from "./components/PilotsHeader";
import PilotsTable from "./components/PilotsTable";
import PilotDialog from "./components/PilotDialog";
import { loadingContainerSx } from "./styles/pilotsStyles";

export default function PilotsPage() {
  const {
    pilots,
    loading,
    dialogOpen,
    form,
    editId,
    handleOpen,
    handleSave,
    handleDelete,
    handleCloseDialog,
    handleFormChange,
  } = usePilots();

  if (loading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PilotsHeader onAdd={() => handleOpen()} />
      <PilotsTable pilots={pilots} onEdit={handleOpen} onDelete={handleDelete} />
      <PilotDialog
        open={dialogOpen}
        editId={editId}
        form={form}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onClose={handleCloseDialog}
      />
    </Box>
  );
}
