import { useCallback } from "react";
import { createReport, deleteReport, getMyReports } from "../api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

export function useReports() {
  const listRequest = useApiRequest(({ signal }) => getMyReports({ signal }), {
    manual: false,
    retries: 1,
  });

  const createRequest = useApiRequest(
    ({ payload, signal }) => createReport(payload, { signal }),
    {
      manual: true,
    },
  );

  const deleteRequest = useApiRequest(
    ({ reportId, signal }) => deleteReport(reportId, { signal }),
    {
      manual: true,
    },
  );

  const reload = useCallback(async () => {
    await listRequest.run({});
  }, [listRequest]);

  const addReport = useCallback(
    async (payload) => {
      await createRequest.run({ payload });
      await reload();
    },
    [createRequest, reload],
  );

  const removeReport = useCallback(
    async (reportId) => {
      await deleteRequest.run({ reportId });
      await reload();
    },
    [deleteRequest, reload],
  );

  return {
    reports: listRequest.data || [],
    isLoading: listRequest.isLoading,
    error: listRequest.error,
    retry: listRequest.retry,
    reload,
    addReport,
    removeReport,
    isMutating: createRequest.isLoading || deleteRequest.isLoading,
  };
}
