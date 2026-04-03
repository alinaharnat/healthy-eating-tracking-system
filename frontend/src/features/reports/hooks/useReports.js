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

  const listRun = listRequest.run;
  const createRun = createRequest.run;
  const deleteRun = deleteRequest.run;

  const reload = useCallback(async () => {
    await listRun({});
  }, [listRun]);

  const addReport = useCallback(
    async (payload) => {
      await createRun({ payload });
      await reload();
    },
    [createRun, reload],
  );

  const removeReport = useCallback(
    async (reportId) => {
      await deleteRun({ reportId });
      await reload();
    },
    [deleteRun, reload],
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
