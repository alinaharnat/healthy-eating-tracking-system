import {
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../core/i18n/useLocale";
import { useMealHistory } from "../../features/meals/hooks/useMealHistory";
import { formatLocalizedDateTime } from "../../shared/lib/format/dateTime";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function MealHistoryPage() {
  const { t } = useTranslation(["meals", "common"]);
  const { language } = useLocale();
  const { period, setPeriod, meals, isLoading, error, retry } =
    useMealHistory("week");

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("meals:history.title")}</Typography>
            <Typography color="text.secondary">
              {t("meals:history.description")}
            </Typography>
          </Stack>

          <TextField
            select
            value={period}
            label={t("meals:history.period")}
            onChange={(event) => setPeriod(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="week">{t("meals:history.week")}</MenuItem>
            <MenuItem value="month">{t("meals:history.month")}</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {error ? (
        <SectionErrorState
          message={error.message}
          onRetry={retry}
          retryLabel={t("common:actions.retry")}
        />
      ) : isLoading ? (
        <SectionLoadingState label={t("common:states.loading")} />
      ) : !meals.length ? (
        <EmptyStateCard
          title={t("meals:empty")}
          description={t("meals:history.emptyDescription")}
        />
      ) : (
        <Stack spacing={1.5}>
          {meals.map((meal) => (
            <Paper key={meal.id} sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
              >
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1">
                    {t(`meals:types.${meal.mealType}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatLocalizedDateTime(meal.date, { language })}
                  </Typography>
                </Stack>

                <Chip
                  label={t("meals:history.items", {
                    count: meal.mealProducts.length,
                  })}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default MealHistoryPage;
