import { Box } from "@mui/material";
import useUsers from "./hooks/useUsers";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import UserDialog from "./components/UserDialog";

export default function AdminUsersPage() {
  const {
    users,
    dialogOpen,
    setDialogOpen,
    form,
    setForm,
    editId,
    showPassword,
    setShowPassword,
    emailError,
    handleEmailChange,
    handleOpen,
    handleSave,
    handleDelete,
  } = useUsers();

  return (
    <Box>
      <UsersHeader onAddUser={() => handleOpen()} />

      <UsersTable users={users} onEdit={handleOpen} onDelete={handleDelete} />

      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        form={form}
        editId={editId}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        emailError={emailError}
        onEmailChange={handleEmailChange}
        onRoleChange={(value) => setForm({ ...form, role: value })}
        onPasswordChange={(value) => setForm({ ...form, password: value })}
        onSave={handleSave}
      />
    </Box>
  );
}
