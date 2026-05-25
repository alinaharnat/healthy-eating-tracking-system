import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../core/i18n/useLocale";
import ActivityWidget from "../../features/activity/components/ActivityWidget";
import { useActivityPageData } from "../../features/activity/hooks/useActivityPageData";
import { formatLocalizedDateTime } from "../../shared/lib/format/dateTime";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function ActivityPage() {
  const { t } = useTranslation(["analytics", "common"]);
  const { language } = useLocale();

  const {
    period,
    setPeriod,
    activePeriod,
    summary,
    measurements,
    isLoading,
    error,
    retry,
    addMeasurement,
    removeMeasurement,
    isMutating,
  } = useActivityPageData("week");

  const hasSummaryData =
    Number(summary?.totalSteps || 0) > 0 || Boolean(summary?.lastMeasurementAt);

  const [form, setForm] = useState({
    pulse: "",
    steps: "",
    weight: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await addMeasurement({
      pulse: Number(form.pulse),
      steps: Number(form.steps),
      weight: form.weight ? Number(form.weight) : undefined,
    });

    setForm({ pulse: "", steps: "", weight: "" });
  };

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
            <Typography variant="h5">
              {t("analytics:activity.title")}
            </Typography>
            <Typography color="text.secondary">
              {t("analytics:activity.description")}
            </Typography>
          </Stack>

          <TextField
            select
            value={period}
            label={t("analytics:activity.period")}
            onChange={(event) => setPeriod(event.target.value)}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="day">{t("analytics:activity.day")}</MenuItem>
            <MenuItem value="week">{t("analytics:activity.week")}</MenuItem>
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
      ) : !hasSummaryData ? (
        <EmptyStateCard
          title={t("analytics:activity.emptyForPeriod", {
            period: t(`analytics:activity.${activePeriod}`),
          })}
        />
      ) : (
        <ActivityWidget summary={summary} period={activePeriod} />
      )}

      <Paper sx={{ p: 3 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h6">
            {t("analytics:activity.addMeasurement")}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label={t("analytics:activity.pulse")}
              name="pulse"
              type="number"
              value={form.pulse}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label={t("analytics:activity.steps")}
              name="steps"
              type="number"
              value={form.steps}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label={t("analytics:activity.weight")}
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              fullWidth
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={isMutating}>
              {t("analytics:activity.saveMeasurement")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">
            {t("analytics:activity.latestMeasurements")}
          </Typography>

          {!measurements.length ? (
            <EmptyStateCard
              title={t("analytics:activity.emptyForPeriod", {
                period: t(`analytics:activity.${activePeriod}`),
              })}
            />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("analytics:activity.recordedAt")}</TableCell>
                  <TableCell>{t("analytics:activity.pulse")}</TableCell>
                  <TableCell>{t("analytics:activity.steps")}</TableCell>
                  <TableCell>{t("analytics:activity.weight")}</TableCell>
                  <TableCell align="right" />
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
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => removeMeasurement(item.id)}
                        disabled={isMutating}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
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

export default ActivityPage;
