import { useCallback, useMemo } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import {
  listPatientAssignmentRequests,
  respondPatientAssignmentRequest,
} from "../api";

export function usePatientAssignmentRequests() {
  const listRequest = useApiRequest(
    ({ signal }) => listPatientAssignmentRequests({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const respondRequest = useApiRequest(
    ({ requestId, payload, signal }) =>
      respondPatientAssignmentRequest(requestId, payload, { signal }),
    {
      manual: true,
    },
  );

  const listRun = listRequest.run;
  const respondRun = respondRequest.run;

  const reload = useCallback(async () => {
    return listRun({});
  }, [listRun]);

  const respond = useCallback(
    async (requestId, payload) => {
      const result = await respondRun({ requestId, payload });
      await reload();
      return result;
    },
    [reload, respondRun],
  );

  const requests = useMemo(() => listRequest.data || [], [listRequest.data]);

  return {
    requests,
    isLoading: listRequest.isLoading,
    error: listRequest.error,
    retry: listRequest.retry,
    reload,
    respond,
    isResponding: respondRequest.isLoading,
    respondError: respondRequest.error,
  };
}
