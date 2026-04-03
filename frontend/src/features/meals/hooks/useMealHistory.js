import { useEffect, useState } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { getMealHistory } from "../api";

export function useMealHistory(initialPeriod = "week") {
  const [period, setPeriod] = useState(initialPeriod);

  const historyRequest = useApiRequest(
    ({ currentPeriod, signal }) =>
      getMealHistory(
        { period: currentPeriod },
        {
          signal,
        },
      ),
    {
      manual: true,
      retries: 1,
    },
  );

  const { data, isLoading, error, retry, cancel, run } = historyRequest;

  useEffect(() => {
    run({ currentPeriod: period }).catch(() => null);
  }, [period, run]);

  return {
    period,
    setPeriod,
    meals: data || [],
    isLoading,
    error,
    retry,
    cancel,
  };
}
