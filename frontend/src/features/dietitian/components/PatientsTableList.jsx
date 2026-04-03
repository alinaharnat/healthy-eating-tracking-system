import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PostAddIcon from "@mui/icons-material/PostAdd";
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
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../../shared/ui/states/SectionLoadingState";

function resolveGoalLabel(t, goalType) {
  if (!goalType) {
    return t("dietitian:goals.notDefined");
  }

  const key = `profile:goals.${goalType}`;
  const translated = t(key);

  if (translated === key) {
    return goalType;
  }

  return translated;
}

function PatientsTableList({
  patients,
  isLoading,
  error,
  onRetry,
  onOpenPatient,
  onCreateRecommendation,
}) {
  const { t } = useTranslation(["dietitian", "profile", "common"]);

  if (error) {
    return (
      <SectionErrorState
        message={error.message}
        onRetry={onRetry}
        retryLabel={t("common:actions.retry")}
      />
    );
  }

  if (isLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  if (!patients.length) {
    return (
      <EmptyStateCard
        title={t("dietitian:patients.emptyTitle")}
        description={t("dietitian:patients.emptyDescription")}
      />
    );
  }

  return (
    <Paper sx={{ p: 2, overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("dietitian:patients.columns.name")}</TableCell>
            <TableCell>{t("dietitian:patients.columns.email")}</TableCell>
            <TableCell>{t("dietitian:patients.columns.goal")}</TableCell>
            <TableCell>{t("dietitian:patients.columns.status")}</TableCell>
            <TableCell align="right">
              {t("dietitian:patients.columns.actions")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {patient.name || t("dietitian:patients.unknownName")}
                </Typography>
              </TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={resolveGoalLabel(t, patient.goalType)}
                  color="default"
                />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={patient.isActive === false ? "default" : "success"}
                  label={
                    patient.isActive === false
                      ? t("dietitian:patients.status.inactive")
                      : t("dietitian:patients.status.active")
                  }
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => onOpenPatient(patient.id)}
                  >
                    {t("dietitian:actions.open")}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PostAddIcon />}
                    onClick={() => onCreateRecommendation(patient.id)}
                  >
                    {t("dietitian:actions.recommend")}
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default PatientsTableList;
