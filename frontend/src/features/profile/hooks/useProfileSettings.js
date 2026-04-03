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

  const saveProfile = useCallback(
    async (payload) => {
      const updatedProfile = await saveRequest.run({ payload });
      await profileRequest.run({});
      return updatedProfile;
    },
    [profileRequest, saveRequest],
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
