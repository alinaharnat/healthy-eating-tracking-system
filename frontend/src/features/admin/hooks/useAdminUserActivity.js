import { useEffect } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { getUserFullActivity } from "../api";

export function useAdminUserActivity(userId) {
  const activityRequest = useApiRequest(
    ({ targetUserId, signal }) => getUserFullActivity(targetUserId, { signal }),
    {
      manual: true,
      retries: 1,
    },
  );

  const run = activityRequest.run;

  useEffect(() => {
    if (!userId) {
      return;
    }

    run({ targetUserId: userId }).catch(() => null);
  }, [run, userId]);

  return {
    user: activityRequest.data?.user || null,
    meals: activityRequest.data?.meals || [],
    measurements: activityRequest.data?.measurements || [],
    isLoading: activityRequest.isLoading,
    error: activityRequest.error,
    retry: activityRequest.retry,
  };
}
