import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import DescriptionIcon from "@mui/icons-material/Description";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../core/i18n/useLocale";
import { formatLocalizedDateTime } from "../../../shared/lib/format/dateTime";
import { formatLocalizedNumber } from "../../../shared/lib/format/number";

function MetricCard({ title, value, subtitle, icon, status }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
          <Stack spacing={1} alignItems="flex-end">
            {icon}
            {status ? <Chip size="small" label={status} /> : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function DashboardCards({
  dailySummary,
  periodAnalytics,
  activitySummary,
  recommendationsCount,
  reportsCount,
  lastUpdatedAt,
}) {
  const { t } = useTranslation([
    "dashboard",
    "analytics",
    "recommendations",
    "reports",
  ]);
  const { language } = useLocale();

  const calories = formatLocalizedNumber(dailySummary?.totals?.calories || 0, {
    language,
  });
  const goal = formatLocalizedNumber(dailySummary?.goal || 0, { language });
  const average = formatLocalizedNumber(periodAnalytics?.averageCalories || 0, {
    language,
  });
  const steps = formatLocalizedNumber(activitySummary?.totalSteps || 0, {
    language,
  });

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {t("dashboard:client.lastUpdated")}:{" "}
        {formatLocalizedDateTime(lastUpdatedAt, { language })}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            title={t("dashboard:cards.dailyCalories")}
            value={t("dashboard:cards.kcal", { value: calories })}
            subtitle={t("dashboard:cards.goal", { value: goal })}
            icon={<LocalFireDepartmentIcon color="warning" />}
            status={dailySummary?.status || "-"}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            title={t("dashboard:cards.weekAverage")}
            value={t("dashboard:cards.kcal", { value: average })}
            subtitle={t("dashboard:cards.periodWeek")}
            icon={<TrendingUpIcon color="primary" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            title={t("analytics:activity.steps")}
            value={steps}
            subtitle={t("dashboard:cards.activityWeek")}
            icon={<DirectionsWalkIcon color="secondary" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            title={t("analytics:activity.burnedCalories")}
            value={t("dashboard:cards.kcal", {
              value: formatLocalizedNumber(
                activitySummary?.burnedCalories || 0,
                {
                  language,
                },
              ),
            })}
            subtitle={t("dashboard:cards.fromIot")}
            icon={<MonitorHeartIcon color="error" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            title={t("recommendations:title")}
            value={formatLocalizedNumber(recommendationsCount || 0, {
              language,
            })}
            subtitle={t("dashboard:cards.activeItems")}
            icon={<TipsAndUpdatesIcon color="success" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            title={t("reports:title")}
            value={formatLocalizedNumber(reportsCount || 0, { language })}
            subtitle={t("dashboard:cards.uploaded")}
            icon={<DescriptionIcon color="action" />}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DashboardCards;
