import { Box, Card, CardContent, Typography, TextField } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";

export default function UserInfoCard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card sx={{ mb: 2, maxWidth: 560, margin: "0 auto" }}>
      <CardContent>
        <Typography variant={{ xs: "h6", sm: "h5", md: "h4" }} fontWeight={600}>Información de usuario</Typography>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <TextField label="Email" value={user.email} disabled fullWidth size="small" />
          <TextField label="Rol" value={user.role} disabled fullWidth size="small" />
        </Box>
      </CardContent>
    </Card>
  );
}
