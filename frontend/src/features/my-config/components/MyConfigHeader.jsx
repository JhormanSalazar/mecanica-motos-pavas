import { Box, Typography } from "@mui/material";
import { UserCog } from "lucide-react";
import {
  headerContainerSx,
  headerLeftSx,
  headerIconBoxSx,
  headerTextBoxSx,
  subtitleSx,
} from "../styles/myConfigStyles";

export default function MyConfigHeader() {
  return (
    <Box sx={headerContainerSx}>
      <Box sx={headerLeftSx}>
        <Box sx={headerIconBoxSx}>
          <UserCog size={20} />
        </Box>
        <Box sx={headerTextBoxSx}>
          <Typography variant="h6" fontWeight={800} noWrap>
            Mi Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={subtitleSx}>
            Actualiza tu información personal y contraseña
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
