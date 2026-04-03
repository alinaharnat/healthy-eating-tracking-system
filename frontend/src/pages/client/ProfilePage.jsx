import { Alert, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../core/auth/useAuth";
import { useLocale } from "../../core/i18n/useLocale";
import ProfileForm from "../../features/profile/components/ProfileForm";
import { useProfileSettings } from "../../features/profile/hooks/useProfileSettings";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function ProfilePage() {
  const { t } = useTranslation(["common"]);
  const { updateUser } = useAuth();
  const { setLanguage, language } = useLocale();

  const { profile, isLoading, error, retry, saveProfile, isSaving, saveError } =
    useProfileSettings();

  const handleSaveProfile = async (payload) => {
    const updatedProfile = await saveProfile(payload);

    updateUser(updatedProfile);

    if (updatedProfile?.language && updatedProfile.language !== language) {
      await setLanguage(updatedProfile.language, { persistToProfile: false });
    }
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

  if (isLoading || !profile) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  return (
    <Stack spacing={2}>
      {saveError ? <Alert severity="error">{saveError.message}</Alert> : null}

      <ProfileForm
        profile={profile}
        isSubmitting={isSaving}
        onSubmit={handleSaveProfile}
      />
    </Stack>
  );
}

export default ProfilePage;
