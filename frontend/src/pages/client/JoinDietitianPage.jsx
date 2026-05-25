import { Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DietitianConnectionSection from "../../features/dietitianConnection/components/DietitianConnectionSection";
import { useDietitianConnection } from "../../features/dietitianConnection/hooks/useDietitianConnection";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function JoinDietitianPage() {
  const { t } = useTranslation(["profile", "common"]);
  const { notify } = useNotification();

  const {
    me,
    dietitians,
    pendingRequest,
    latestResolvedRequest,
    canSendRequest,
    isLoading,
    error,
    retry,
    sendRequest,
    cancelPendingRequest,
    createError,
    cancelError,
    isMutating,
  } = useDietitianConnection();

  const handleSendRequest = async (payload) => {
    await sendRequest(payload);

    notify({
      severity: "success",
      key: "profile.dietitianConnection.notifications.requestSent",
      namespace: "profile",
    });
  };

  const handleCancelRequest = async (requestId) => {
    await cancelPendingRequest(requestId);

    notify({
      severity: "success",
      key: "profile.dietitianConnection.notifications.requestCanceled",
      namespace: "profile",
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
          <Typography variant="h5">
            {t("profile:dietitianConnection.title")}
          </Typography>
          <Typography color="text.secondary">
            {t("profile:dietitianConnection.description")}
          </Typography>
        </Stack>
      </Paper>

      <DietitianConnectionSection
        me={me}
        dietitians={dietitians}
        pendingRequest={pendingRequest}
        latestResolvedRequest={latestResolvedRequest}
        canSendRequest={canSendRequest}
        onSendRequest={handleSendRequest}
        onCancelRequest={handleCancelRequest}
        isMutating={isMutating}
        createError={createError}
        cancelError={cancelError}
      />
    </Stack>
  );
}

export default JoinDietitianPage;
