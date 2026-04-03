import { useCallback, useMemo } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import {
  createRecommendationForPatient,
  deleteDietitianRecommendation,
  listDietitianRecommendations,
} from "../api";

export function useDietitianRecommendations({ patientId = null } = {}) {
  const normalizedPatientId = patientId || null;

  const listRequest = useApiRequest(
    ({ targetPatientId, signal }) =>
      listDietitianRecommendations(
        {
          patientId: targetPatientId,
        },
        { signal },
      ),
    {
      manual: false,
      retries: 1,
      immediateParams: {
        targetPatientId: normalizedPatientId,
      },
    },
  );

  const createRequest = useApiRequest(
    ({ payload, signal }) =>
      createRecommendationForPatient(payload, { signal }),
    {
      manual: true,
    },
  );

  const deleteRequest = useApiRequest(
    ({ recommendationId, signal }) =>
      deleteDietitianRecommendation(recommendationId, { signal }),
    {
      manual: true,
    },
  );

  const listRun = listRequest.run;
  const createRun = createRequest.run;
  const deleteRun = deleteRequest.run;

  const reload = useCallback(
    async (targetPatientId = normalizedPatientId) => {
      return listRun({
        targetPatientId: targetPatientId || null,
      });
    },
    [listRun, normalizedPatientId],
  );

  const createForPatient = useCallback(
    async (payload) => {
      const created = await createRun({ payload });
      await reload();
      return created;
    },
    [createRun, reload],
  );

  const removeRecommendation = useCallback(
    async (recommendationId) => {
      await deleteRun({ recommendationId });
      await reload();
    },
    [deleteRun, reload],
  );

  const recommendations = useMemo(
    () => listRequest.data || [],
    [listRequest.data],
  );

  return {
    recommendations,
    isLoading: listRequest.isLoading,
    error: listRequest.error,
    retry: listRequest.retry,
    reload,
    createForPatient,
    removeRecommendation,
    createError: createRequest.error,
    deleteError: deleteRequest.error,
    isMutating: createRequest.isLoading || deleteRequest.isLoading,
  };
}
