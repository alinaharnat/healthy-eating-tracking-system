import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "../../shared/ui/LanguageSwitcher";

function AuthLayout() {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        background:
          "linear-gradient(145deg, rgba(31,111,235,0.12) 0%, rgba(0,166,126,0.1) 100%)",
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 430, p: 4 }} elevation={3}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <LanguageSwitcher minWidth={132} />
        </Box>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4">{t("common:app.name")}</Typography>
          <Typography color="text.secondary">
            {t("auth:layoutSubtitle")}
          </Typography>
        </Stack>
        <Outlet />
      </Paper>
    </Box>
  );
}

export default AuthLayout;
