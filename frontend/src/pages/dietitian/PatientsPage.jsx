import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PatientsTableList from "../../features/dietitian/components/PatientsTableList";
import RemovePatientConfirmationDialog from "../../features/dietitian/components/RemovePatientConfirmationDialog";
import { useDietitianPatients } from "../../features/dietitian/hooks/useDietitianPatients";
import { useLocale } from "../../core/i18n/useLocale";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import { sortByLocale } from "../../shared/lib/sort/localeSort";
import { PATHS } from "../../router/paths";

function PatientsPage() {
  const { t } = useTranslation("dietitian");
  const { language } = useLocale();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [search, setSearch] = useState("");
  const [pendingRemovePatientId, setPendingRemovePatientId] = useState(null);

  const {
    patients,
    isLoading,
    error,
    retry,
    removePatient,
    isRemovingPatient,
  } = useDietitianPatients();

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const list = normalizedSearch
      ? patients.filter((patient) => {
          return (
            patient.name?.toLowerCase().includes(normalizedSearch) ||
            patient.email?.toLowerCase().includes(normalizedSearch)
          );
        })
      : patients;

    return sortByLocale(list, (item) => item.name, language);
  }, [language, patients, search]);

  const handleOpenPatient = (patientId) => {
    navigate(PATHS.dietitian.patientDetails(patientId));
  };

  const handleCreateRecommendation = (patientId) => {
    navigate(`${PATHS.dietitian.recommendationsCreate}?patientId=${patientId}`);
  };

  const selectedPatientForRemove = useMemo(
    () =>
      filteredPatients.find((item) => item.id === pendingRemovePatientId) ||
      null,
    [filteredPatients, pendingRemovePatientId],
  );

  const handleConfirmRemove = async () => {
    if (!pendingRemovePatientId) {
      return;
    }

    await removePatient(pendingRemovePatientId);
    setPendingRemovePatientId(null);
    notify({
      severity: "success",
      key: "dietitian.patients.notifications.unassigned",
      namespace: "dietitian",
    });
  };

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
            <Typography variant="h5">{t("patients.title")}</Typography>
            <Typography color="text.secondary">
              {t("patients.description")}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              label={t("patients.search")}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate(PATHS.dietitian.recommendationsCreate)}
            >
              {t("actions.createRecommendation")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <PatientsTableList
        patients={filteredPatients}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        onOpenPatient={handleOpenPatient}
        onCreateRecommendation={handleCreateRecommendation}
        onUnassignPatient={setPendingRemovePatientId}
        isMutating={isRemovingPatient}
      />

      <RemovePatientConfirmationDialog
        open={Boolean(selectedPatientForRemove)}
        patient={selectedPatientForRemove}
        onClose={() => setPendingRemovePatientId(null)}
        onConfirm={handleConfirmRemove}
        isSubmitting={isRemovingPatient}
      />
    </Stack>
  );
}

export default PatientsPage;
