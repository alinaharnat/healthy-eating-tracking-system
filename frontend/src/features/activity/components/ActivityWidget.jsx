import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../core/i18n/useLocale";
import { formatLocalizedNumber } from "../../../shared/lib/format/number";

function ActivityMetricCard({ title, value, subtitle, icon }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
            {subtitle ? (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ActivityWidget({ summary }) {
  const { t } = useTranslation("analytics");
  const { language } = useLocale();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <ActivityMetricCard
          title={t("activity.steps")}
          value={formatLocalizedNumber(summary?.totalSteps || 0, { language })}
          subtitle={t("activity.period")}
          icon={<DirectionsWalkIcon color="secondary" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <ActivityMetricCard
          title={t("activity.burnedCalories")}
          value={t("activity.kcal", {
            value: formatLocalizedNumber(summary?.burnedCalories || 0, {
              language,
            }),
          })}
          subtitle={t("activity.estimated")}
          icon={<LocalFireDepartmentIcon color="warning" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <ActivityMetricCard
          title={t("activity.lastWeight")}
          value={
            summary?.lastWeight
              ? t("activity.kg", {
                  value: formatLocalizedNumber(summary.lastWeight, {
                    language,
                  }),
                })
              : t("activity.notAvailable")
          }
          subtitle={t("activity.latestMeasurement")}
          icon={<MonitorWeightIcon color="primary" />}
        />
      </Grid>
    </Grid>
  );
}

export default ActivityWidget;
