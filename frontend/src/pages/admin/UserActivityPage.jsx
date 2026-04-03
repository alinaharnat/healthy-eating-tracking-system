import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminUserActivity } from "../../features/admin/hooks/useAdminUserActivity";
import { useLocale } from "../../core/i18n/useLocale";
import { formatLocalizedDateTime } from "../../shared/lib/format/dateTime";
import { PATHS } from "../../router/paths";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function UserActivityPage() {
  const { t } = useTranslation(["admin", "common", "meals", "analytics"]);
  const { language } = useLocale();
  const navigate = useNavigate();
  const { userId } = useParams();

  const { user, meals, measurements, isLoading, error, retry } =
    useAdminUserActivity(userId);

  if (error) {
    return (
      <SectionErrorState
        message={error.message}
        onRetry={retry}
        retryLabel={t("common:actions.retry")}
      />
    );
  }

  if (isLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("activity.title")}</Typography>
            <Typography color="text.secondary">
              {t("activity.description")}
            </Typography>
            {user ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                <Chip size="small" label={user.email} />
              </Stack>
            ) : null}
          </Stack>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(PATHS.admin.users)}
          >
            {t("actions.backToUsers")}
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, overflowX: "auto" }}>
        <Stack spacing={1}>
          <Typography variant="h6">{t("activity.mealsTitle")}</Typography>
          {!meals.length ? (
            <EmptyStateCard title={t("activity.emptyMeals")} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("activity.columns.date")}</TableCell>
                  <TableCell>{t("activity.columns.mealType")}</TableCell>
                  <TableCell>{t("activity.columns.products")}</TableCell>
                  <TableCell>{t("activity.columns.calories")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>
                      {formatLocalizedDateTime(meal.date, { language })}
                    </TableCell>
                    <TableCell>{t(`meals:types.${meal.mealType}`)}</TableCell>
                    <TableCell>{meal.mealProducts.length}</TableCell>
                    <TableCell>
                      {Math.round(meal.totals?.calories || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, overflowX: "auto" }}>
        <Stack spacing={1}>
          <Typography variant="h6">
            {t("activity.measurementsTitle")}
          </Typography>
          {!measurements.length ? (
            <EmptyStateCard title={t("activity.emptyMeasurements")} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("activity.columns.date")}</TableCell>
                  <TableCell>{t("analytics:activity.pulse")}</TableCell>
                  <TableCell>{t("analytics:activity.steps")}</TableCell>
                  <TableCell>{t("analytics:activity.weight")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {measurements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {formatLocalizedDateTime(item.createdAt, { language })}
                    </TableCell>
                    <TableCell>{item.pulse}</TableCell>
                    <TableCell>{item.steps}</TableCell>
                    <TableCell>{item.weight ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default UserActivityPage;
