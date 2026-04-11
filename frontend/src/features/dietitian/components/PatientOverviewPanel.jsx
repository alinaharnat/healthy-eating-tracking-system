import {
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function MetricCard({ label, value }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={0.4}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6">{value}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function toFixed(value, digits = 0) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number.toFixed(digits) : "0";
}

function PatientOverviewPanel({ overview }) {
  const { t } = useTranslation("dietitian");

  if (!overview) {
    return null;
  }

  const daily = overview.dailyNutrition;
  const weekly = overview.weeklyNutrition;
  const monthly = overview.monthlyNutrition;
  const activity = overview.activity;

  const weeklyPreview = (weekly?.days || []).slice(-7);
  const monthlyPreview = (monthly?.days || []).slice(-8);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6">
            {t("patientDetails.overviewTitle")}
          </Typography>
          <Typography color="text.secondary">
            {t("patientDetails.overviewDescription")}
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.dailyCalories")}
              value={`${toFixed(daily?.totals?.calories)} kcal`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.proteins")}
              value={`${toFixed(daily?.totals?.proteins, 1)} g`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.fats")}
              value={`${toFixed(daily?.totals?.fats, 1)} g`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.carbs")}
              value={`${toFixed(daily?.totals?.carbs, 1)} g`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.calorieGoal")}
              value={
                daily?.goal
                  ? `${toFixed(daily?.goal)} kcal`
                  : t("patientDetails.notAvailable")
              }
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.steps")}
              value={toFixed(activity?.totalSteps)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.burnedCalories")}
              value={`${toFixed(activity?.burnedCalories)} kcal`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <MetricCard
              label={t("overview.latestWeight")}
              value={
                activity?.lastWeight
                  ? `${toFixed(activity?.lastWeight, 1)} kg`
                  : t("patientDetails.notAvailable")
              }
            />
          </Grid>
        </Grid>

        <Divider />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">
                    {t("overview.weeklyTrend")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("overview.averageCalories", {
                      value: toFixed(weekly?.averageCalories),
                    })}
                  </Typography>
                  {(weeklyPreview || []).map((day) => (
                    <Stack
                      key={`week-${day.date}`}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {day.date}
                      </Typography>
                      <Typography variant="caption">
                        {toFixed(day.calories)} kcal
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">
                    {t("overview.monthlyTrend")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("overview.averageCalories", {
                      value: toFixed(monthly?.averageCalories),
                    })}
                  </Typography>
                  {(monthlyPreview || []).map((day) => (
                    <Stack
                      key={`month-${day.date}`}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {day.date}
                      </Typography>
                      <Typography variant="caption">
                        {toFixed(day.calories)} kcal
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}

export default PatientOverviewPanel;
