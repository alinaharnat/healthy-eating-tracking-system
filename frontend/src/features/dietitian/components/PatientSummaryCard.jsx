import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function PatientSummaryCard({ patient }) {
  const { t } = useTranslation(["dietitian", "profile"]);

  if (!patient) {
    return null;
  }

  const goalLabel = patient.goalType
    ? t(`profile:goals.${patient.goalType}`)
    : t("dietitian:goals.notDefined");

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6">{patient.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {patient.email}
              </Typography>
            </Stack>
            <Chip
              size="small"
              color={patient.isActive === false ? "default" : "success"}
              label={
                patient.isActive === false
                  ? t("dietitian:patients.status.inactive")
                  : t("dietitian:patients.status.active")
              }
            />
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("dietitian:patientDetails.fields.goal")}
              </Typography>
              <Typography>{goalLabel}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("dietitian:patientDetails.fields.dailyGoal")}
              </Typography>
              <Typography>
                {patient.dailyCalorieGoal
                  ? `${patient.dailyCalorieGoal} kcal`
                  : t("dietitian:patientDetails.notAvailable")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("dietitian:patientDetails.fields.age")}
              </Typography>
              <Typography>
                {patient.age ?? t("dietitian:patientDetails.notAvailable")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("dietitian:patientDetails.fields.weight")}
              </Typography>
              <Typography>
                {patient.weight
                  ? `${patient.weight} kg`
                  : t("dietitian:patientDetails.notAvailable")}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PatientSummaryCard;
