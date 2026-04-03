import { useMemo } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { getSystemStatistics } from "../api";

export function useAdminSystemStatistics() {
  const request = useApiRequest(
    ({ signal }) => getSystemStatistics({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const stats = useMemo(
    () =>
      request.data || {
        usersCount: 0,
        rolesCount: {
          client: 0,
          dietitian: 0,
          admin: 0,
        },
        mostUsedProducts: [],
        averageCalories: 0,
      },
    [request.data],
  );

  return {
    stats,
    isLoading: request.isLoading,
    error: request.error,
    retry: request.retry,
  };
}
