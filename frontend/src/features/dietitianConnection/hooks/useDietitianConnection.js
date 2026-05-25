import { useCallback, useMemo } from "react";
import {
  cancelDietitianRequest,
  createDietitianRequest,
  getMe,
  listDietitians,
  listOutgoingDietitianRequests,
} from "../../users/api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

export function useDietitianConnection() {
  const meRequest = useApiRequest(({ signal }) => getMe({ signal }), {
    manual: false,
    retries: 1,
  });

  const requestsRequest = useApiRequest(
    ({ signal }) => listOutgoingDietitianRequests({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const dietitiansRequest = useApiRequest(
    ({ signal }) => listDietitians({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const createRequest = useApiRequest(
    ({ payload, signal }) => createDietitianRequest(payload, { signal }),
    {
      manual: true,
    },
  );

  const cancelRequest = useApiRequest(
    ({ requestId, signal }) => cancelDietitianRequest(requestId, { signal }),
    {
      manual: true,
    },
  );

  const reload = useCallback(async () => {
    await Promise.all([
      meRequest.run({}),
      requestsRequest.run({}),
      dietitiansRequest.run({}),
    ]);
  }, [dietitiansRequest, meRequest, requestsRequest]);

  const sendRequest = useCallback(
    async (payload) => {
      const result = await createRequest.run({ payload });
      await reload();
      return result;
    },
    [createRequest, reload],
  );

  const cancelPendingRequest = useCallback(
    async (requestId) => {
      const result = await cancelRequest.run({ requestId });
      await reload();
      return result;
    },
    [cancelRequest, reload],
  );

  const me = meRequest.data || null;
  const outgoingRequests = useMemo(
    () => requestsRequest.data || [],
    [requestsRequest.data],
  );
  const dietitians = useMemo(
    () => dietitiansRequest.data || [],
    [dietitiansRequest.data],
  );

  const pendingRequest = useMemo(
    () => outgoingRequests.find((item) => item.status === "pending") || null,
    [outgoingRequests],
  );

  const latestResolvedRequest = useMemo(
    () =>
      outgoingRequests.find(
        (item) => item.status !== "pending" && item.status !== "accepted",
      ) || null,
    [outgoingRequests],
  );

  const isConnected = Boolean(me?.dietitianId);
  const canSendRequest = !isConnected && !pendingRequest;

  return {
    me,
    isConnected,
    dietitians,
    outgoingRequests,
    pendingRequest,
    latestResolvedRequest,
    canSendRequest,
    isLoading:
      meRequest.isLoading ||
      requestsRequest.isLoading ||
      dietitiansRequest.isLoading,
    error: meRequest.error || requestsRequest.error || dietitiansRequest.error,
    retry: reload,
    reload,
    sendRequest,
    cancelPendingRequest,
    createError: createRequest.error,
    cancelError: cancelRequest.error,
    isMutating: createRequest.isLoading || cancelRequest.isLoading,
  };
}
