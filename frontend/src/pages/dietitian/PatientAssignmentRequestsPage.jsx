import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePatientAssignmentRequests } from "../../features/dietitian/hooks/usePatientAssignmentRequests";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function resolveStatusColor(status) {
  if (status === "accepted") {
    return "success";
  }

  if (status === "rejected" || status === "cancelled") {
    return "default";
  }

  return "warning";
}

function PatientAssignmentRequestsPage() {
  const { t } = useTranslation(["dietitian", "common"]);
  const { notify } = useNotification();

  const { requests, isLoading, error, retry, respond, isResponding } =
    usePatientAssignmentRequests();

  const pendingRequests = useMemo(
    () => requests.filter((item) => item.status === "pending"),
    [requests],
  );

  const recentHandledRequests = useMemo(
    () => requests.filter((item) => item.status !== "pending").slice(0, 8),
    [requests],
  );

  const handleRespond = async (requestId, decision) => {
    await respond(requestId, {
      decision,
    });

    notify({
      severity: "success",
      key:
        decision === "accepted"
          ? "dietitian.requests.notifications.accepted"
          : "dietitian.requests.notifications.rejected",
      namespace: "dietitian",
    });
  };

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
        <Stack spacing={0.5}>
          <Typography variant="h5">{t("requests.title")}</Typography>
          <Typography color="text.secondary">
            {t("requests.description")}
          </Typography>
        </Stack>
      </Paper>

      {!pendingRequests.length ? (
        <EmptyStateCard
          title={t("requests.emptyPendingTitle")}
          description={t("requests.emptyPendingDescription")}
        />
      ) : (
        <Stack spacing={1.5}>
          <Typography variant="h6">{t("requests.pendingTitle")}</Typography>
          {pendingRequests.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle1">
                        {item.client?.name || t("patients.unknownName")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.client?.email || t("patientDetails.notAvailable")}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      color={resolveStatusColor(item.status)}
                      label={t(`requests.status.${item.status}`)}
                    />
                  </Stack>

                  {item.message ? (
                    <Typography variant="body2">{item.message}</Typography>
                  ) : null}

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                      onClick={() => handleRespond(item.id, "rejected")}
                      disabled={isResponding}
                    >
                      {t("requests.actions.reject")}
                    </Button>
                    <Button
                      color="success"
                      variant="contained"
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={() => handleRespond(item.id, "accepted")}
                      disabled={isResponding}
                    >
                      {t("requests.actions.accept")}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Stack spacing={1.5}>
        <Typography variant="h6">{t("requests.recentTitle")}</Typography>
        {!recentHandledRequests.length ? (
          <EmptyStateCard
            title={t("requests.emptyRecentTitle")}
            description={t("requests.emptyRecentDescription")}
          />
        ) : (
          <Stack spacing={1.25}>
            {recentHandledRequests.map((item) => (
              <Card key={`handled-${item.id}`} variant="outlined">
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle2">
                        {item.client?.name || t("patients.unknownName")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.client?.email || t("patientDetails.notAvailable")}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      icon={<PendingActionsIcon />}
                      color={resolveStatusColor(item.status)}
                      label={t(`requests.status.${item.status}`)}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default PatientAssignmentRequestsPage;
