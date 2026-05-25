import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function statusColor(status) {
  if (status === "accepted") {
    return "success";
  }

  if (
    status === "rejected" ||
    status === "cancelled" ||
    status === "canceled"
  ) {
    return "default";
  }

  return "warning";
}

function JoinRequestStatusCard({
  me,
  pendingRequest,
  latestResolvedRequest,
  onCancelRequest,
  isMutating,
}) {
  const { t } = useTranslation(["profile", "common"]);

  if (me?.dietitianId) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">
              {t("profile:dietitianConnection.status.connectedTitle")}
            </Typography>
            <Typography color="text.secondary">
              {t("profile:dietitianConnection.status.connectedDescription")}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color="success"
                label={t("profile:dietitianConnection.status.labels.connected")}
              />
              <Typography variant="body2">
                {me?.dietitian?.name || me?.dietitian?.email || me?.dietitianId}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (pendingRequest) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">
              {t("profile:dietitianConnection.status.pendingTitle")}
            </Typography>
            <Typography color="text.secondary">
              {t("profile:dietitianConnection.status.pendingDescription")}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  color={statusColor(pendingRequest.status)}
                  label={t("profile:dietitianConnection.status.labels.pending")}
                />
                <Typography variant="body2">
                  {pendingRequest?.dietitian?.name ||
                    pendingRequest?.dietitian?.email ||
                    pendingRequest?.dietitianId}
                </Typography>
              </Stack>
              <Button
                color="error"
                variant="outlined"
                onClick={() => onCancelRequest(pendingRequest.id)}
                disabled={isMutating}
              >
                {t("profile:dietitianConnection.actions.cancelRequest")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">
            {t("profile:dietitianConnection.status.unassignedTitle")}
          </Typography>
          <Typography color="text.secondary">
            {t("profile:dietitianConnection.status.unassignedDescription")}
          </Typography>
          {latestResolvedRequest ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color={statusColor(latestResolvedRequest.status)}
                label={t(
                  `profile:dietitianConnection.status.labels.${latestResolvedRequest.status}`,
                )}
              />
              <Typography variant="body2" color="text.secondary">
                {t("profile:dietitianConnection.status.latestRequestHint")}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default JoinRequestStatusCard;
