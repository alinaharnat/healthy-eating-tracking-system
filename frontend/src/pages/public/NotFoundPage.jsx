import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageIntroCard from "../../shared/ui/PageIntroCard";
import { PATHS } from "../../router/paths";

function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <Stack spacing={2} sx={{ maxWidth: 560, mx: "auto", mt: 6, p: 2 }}>
      <PageIntroCard
        title={t("pages.notFound.title")}
        description={t("pages.notFound.description")}
      />
      <Button component={Link} to={PATHS.root} variant="contained">
        {t("actions.goHome")}
      </Button>
    </Stack>
  );
}

export default NotFoundPage;
