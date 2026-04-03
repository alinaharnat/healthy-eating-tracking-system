import { useCallback } from "react";
import { getMe, updateMe } from "../../users/api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

export function useProfileSettings() {
  const profileRequest = useApiRequest(({ signal }) => getMe({ signal }), {
    manual: false,
    retries: 1,
  });

  const saveRequest = useApiRequest(
    ({ payload, signal }) => updateMe(payload, { signal }),
    {
      manual: true,
    },
  );

  const profileRun = profileRequest.run;
  const saveRun = saveRequest.run;

  const saveProfile = useCallback(
    async (payload) => {
      const updatedProfile = await saveRun({ payload });
      await profileRun({});
      return updatedProfile;
    },
    [profileRun, saveRun],
  );

  return {
    profile: profileRequest.data,
    isLoading: profileRequest.isLoading,
    error: profileRequest.error,
    retry: profileRequest.retry,
    reload: profileRequest.run,
    saveProfile,
    isSaving: saveRequest.isLoading,
    saveError: saveRequest.error,
  };
}
