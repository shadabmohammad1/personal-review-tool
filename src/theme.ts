import { createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    background: {
      default: "#0F1014",
      paper: "#1C1E24",
    },
    type: "light",
    primary: {
      main: "#4ABA8E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFFFFF",
      contrastText: "#20222a",
    },
    error: {
      main: "#FF7C03",
      contrastText: "#20222a",
    },
  },
  typography: {
    fontFamily: "'Poppins-Regular'",
    subtitle1: {
      fontFamily: "'Poppins-Regular'",
      fontWeight: 400,
      fontSize: 16,
      letterSpacing: "0.03em",
      color: "#FFFFFF",
    },
    subtitle2: {
      fontFamily: "'Poppins-Regular'",
      fontWeight: 400,
      fontSize: 14,
      letterSpacing: "0.03em",
      color: "#D3D1D1",
    },
    body1: {
      fontFamily: "'Poppins-Regular'",
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: "0.03em",
      color: "#FFFFFF",
    },
    body2: {
      fontFamily: "'Poppins-Light'",
      fontWeight: 400,
      fontSize: 10,
      letterSpacing: "0.03em",
      color: "#FFFFFF",
    },
    caption: {
      fontSize: 9,
      fontWeight: 200,
      fontFamily: "'Poppins-Light'",
      lineHeight: "2.3em",
      color: "#FFFFFF",
    },
    button: {
      fontSize: "0.875rem",
      textTransform: "none",
      fontWeight: 500,
      fontFamily: "'Poppins-Light'",
      color: "rgba(0, 0, 0, 0.87)",
    },
  },
});

export default theme;
