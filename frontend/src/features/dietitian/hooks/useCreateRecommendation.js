import { useCallback } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { createRecommendationForPatient } from "../api";

export function useCreateRecommendation() {
  const createRequest = useApiRequest(
    ({ payload, signal }) =>
      createRecommendationForPatient(payload, { signal }),
    {
      manual: true,
    },
  );

  const createRun = createRequest.run;

  const createRecommendation = useCallback(
    async (payload) => {
      return createRun({ payload });
    },
    [createRun],
  );

  return {
    createRecommendation,
    isSubmitting: createRequest.isLoading,
    error: createRequest.error,
  };
}
