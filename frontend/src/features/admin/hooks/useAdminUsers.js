import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { getAllUsers } from "../api";

export function useAdminUsers() {
  const request = useApiRequest(
    ({ signal }) =>
      getAllUsers({
        signal,
      }),
    {
      manual: false,
      retries: 1,
      retryDelayMs: 300,
    },
  );

  return {
    users: request.data || [],
    isLoading: request.isLoading,
    error: request.error,
    retry: request.retry,
    reload: request.run,
    cancel: request.cancel,
  };
}
