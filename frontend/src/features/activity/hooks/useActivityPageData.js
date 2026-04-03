import { useCallback, useEffect, useState } from "react";
import { getActivitySummary } from "../../analytics/api";
import {
  createMeasurement,
  deleteMeasurement,
  getLatestMeasurements,
} from "../../iot/api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

export function useActivityPageData(initialPeriod = "week") {
  const [period, setPeriod] = useState(initialPeriod);

  const summaryRequest = useApiRequest(
    ({ nextPeriod, signal }) =>
      getActivitySummary(
        {
          period: nextPeriod,
        },
        { signal },
      ),
    {
      manual: true,
      retries: 1,
    },
  );

  const measurementsRequest = useApiRequest(
    ({ signal }) => getLatestMeasurements({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const createRequest = useApiRequest(
    ({ payload, signal }) => createMeasurement(payload, { signal }),
    {
      manual: true,
    },
  );

  const deleteRequest = useApiRequest(
    ({ measurementId, signal }) => deleteMeasurement(measurementId, { signal }),
    {
      manual: true,
    },
  );

  const summaryRun = summaryRequest.run;
  const measurementsRun = measurementsRequest.run;
  const createRun = createRequest.run;
  const deleteRun = deleteRequest.run;

  useEffect(() => {
    summaryRun({ nextPeriod: period }).catch(() => null);
  }, [period, summaryRun]);

  const reloadAll = useCallback(async () => {
    await Promise.all([
      summaryRun({ nextPeriod: period }),
      measurementsRun({}),
    ]);
  }, [measurementsRun, period, summaryRun]);

  const addMeasurement = useCallback(
    async (payload) => {
      await createRun({ payload });
      await reloadAll();
    },
    [createRun, reloadAll],
  );

  const removeMeasurement = useCallback(
    async (measurementId) => {
      await deleteRun({ measurementId });
      await reloadAll();
    },
    [deleteRun, reloadAll],
  );

  return {
    period,
    setPeriod,
    summary: summaryRequest.data,
    measurements: measurementsRequest.data || [],
    isLoading: summaryRequest.isLoading || measurementsRequest.isLoading,
    error: summaryRequest.error || measurementsRequest.error,
    retry: reloadAll,
    addMeasurement,
    removeMeasurement,
    isMutating: createRequest.isLoading || deleteRequest.isLoading,
  };
}
