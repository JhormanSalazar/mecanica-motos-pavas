import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const ResponsiveMain = styled(Box, {
  shouldForwardProp: (prop) => prop !== "drawerWidth",
})(({ theme, drawerWidth = 0 }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  width: "100%",
  marginLeft: 0,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up("md")]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  },
}));

export default ResponsiveMain;
