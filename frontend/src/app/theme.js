import { createTheme } from "@mui/material/styles";
import { enUS, ukUA } from "@mui/material/locale";

const baseThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#1f6feb",
    },
    secondary: {
      main: "#00a67e",
    },
    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: ["Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
};

const muiLocales = {
  en: enUS,
  ua: ukUA,
};

export function buildAppTheme({ language, direction }) {
  return createTheme(
    {
      ...baseThemeOptions,
      direction,
    },
    muiLocales[language] || enUS,
  );
}
