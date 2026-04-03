import { useCallback } from "react";
import { generateAutoRecommendations } from "../../analytics/api";
import { deleteRecommendation, listMyRecommendations } from "../api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

export function useRecommendations() {
  const listRequest = useApiRequest(
    ({ signal }) => listMyRecommendations({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const generateRequest = useApiRequest(
    ({ signal }) => generateAutoRecommendations({ signal }),
    {
      manual: true,
    },
  );

  const deleteRequest = useApiRequest(
    ({ recommendationId, signal }) =>
      deleteRecommendation(recommendationId, { signal }),
    {
      manual: true,
    },
  );

  const listRun = listRequest.run;
  const generateRun = generateRequest.run;
  const deleteRun = deleteRequest.run;

  const reload = useCallback(async () => {
    await listRun({});
  }, [listRun]);

  const generate = useCallback(async () => {
    await generateRun({});
    await reload();
  }, [generateRun, reload]);

  const remove = useCallback(
    async (recommendationId) => {
      await deleteRun({ recommendationId });
      await reload();
    },
    [deleteRun, reload],
  );

  return {
    recommendations: listRequest.data || [],
    isLoading: listRequest.isLoading,
    error: listRequest.error,
    retry: listRequest.retry,
    reload,
    generate,
    remove,
    isMutating: generateRequest.isLoading || deleteRequest.isLoading,
  };
}
