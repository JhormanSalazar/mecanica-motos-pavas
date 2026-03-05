import { Box, Typography } from "@mui/material";
import { Plus, Users } from "lucide-react";
import ResponsiveButton from "../../../components/ResponsiveButton";
import {
  headerContainerSx,
  headerLeftSx,
  headerIconBoxSx,
  headerTextBoxSx,
  subtitleSx,
} from "../styles/usersStyles";

export default function UsersHeader({ onAddUser }) {
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerLeftSx}>
        <Box sx={headerIconBoxSx}>
          <Users size={20} />
        </Box>
        <Box sx={headerTextBoxSx}>
          <Typography variant="h6" fontWeight={800} noWrap>
            Usuarios
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={subtitleSx}
          >
            Administra los usuarios del sistema
          </Typography>
        </Box>
      </Box>
      <ResponsiveButton
        variant="contained"
        startIcon={<Plus size={20} />}
        onClick={onAddUser}
      >
        Nuevo Usuario
      </ResponsiveButton>
    </Box>
  );
}
