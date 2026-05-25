import { useCallback, useEffect, useRef, useState } from "react";
import { getActivitySummary } from "../../analytics/api";
import {
  createMeasurement,
  deleteMeasurement,
  getLatestMeasurements,
} from "../../iot/api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

export function useActivityPageData(initialPeriod = "week") {
  const [period, setPeriod] = useState(initialPeriod);
  const periodRef = useRef(initialPeriod);

  const summaryRequest = useApiRequest(
    ({ period: requestPeriod, signal }) =>
      getActivitySummary(
        {
          period: requestPeriod,
        },
        { signal },
      ),
    {
      manual: true,
      retries: 1,
    },
  );

  const measurementsRequest = useApiRequest(
    ({ period: requestPeriod, signal }) =>
      getLatestMeasurements(
        {
          period: requestPeriod,
        },
        { signal },
      ),
    {
      manual: true,
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
    periodRef.current = period;
  }, [period]);

  useEffect(() => {
    Promise.all([summaryRun({ period }), measurementsRun({ period })]).catch(
      () => null,
    );
  }, [measurementsRun, period, summaryRun]);

  const reloadAll = useCallback(
    async (requestedPeriod = periodRef.current) => {
      await Promise.all([
        summaryRun({ period: requestedPeriod }),
        measurementsRun({ period: requestedPeriod }),
      ]);
    },
    [measurementsRun, summaryRun],
  );

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
    activePeriod: summaryRequest.data?.period || period,
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
