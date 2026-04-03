import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function StatCard({ title, value, subtitle }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatisticsCards({ stats }) {
  const { t } = useTranslation("admin");

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title={t("statistics.cards.totalUsers")}
          value={stats.usersCount || 0}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title={t("statistics.cards.clients")}
          value={stats?.rolesCount?.client || 0}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title={t("statistics.cards.dietitians")}
          value={stats?.rolesCount?.dietitian || 0}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title={t("statistics.cards.averageCalories")}
          value={`${Math.round(stats.averageCalories || 0)} ${t("statistics.units.kcal")}`}
        />
      </Grid>
    </Grid>
  );
}

export default StatisticsCards;
