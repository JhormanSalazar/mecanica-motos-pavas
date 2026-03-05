import { Box, CircularProgress } from "@mui/material";
import useChecklistItems from "./hooks/useChecklistItems";
import ChecklistItemsHeader from "./components/ChecklistItemsHeader";
import ChecklistItemsTable from "./components/ChecklistItemsTable";
import ChecklistItemDialog from "./components/ChecklistItemDialog";
import { loadingContainerSx } from "./styles/checklistItemsStyles";

export default function ChecklistItemsPage() {
  const {
    items,
    loading,
    dialogOpen,
    setDialogOpen,
    form,
    setForm,
    editId,
    handleOpen,
    handleSave,
    handleDelete,
    toggleActive,
  } = useChecklistItems();

  if (loading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <ChecklistItemsHeader onNewItem={() => handleOpen()} />

      <ChecklistItemsTable
        items={items}
        onEdit={handleOpen}
        onDelete={handleDelete}
        onToggleActive={toggleActive}
      />

      <ChecklistItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        form={form}
        onFormChange={setForm}
        editId={editId}
        onSave={handleSave}
      />
    </Box>
  );
}
