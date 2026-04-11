import { useMemo } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { getDietitianPatientOverview } from "../api";
import { useDietitianPatients } from "./useDietitianPatients";
import { useDietitianRecommendations } from "./useDietitianRecommendations";

export function usePatientDetailsData(patientId) {
  const {
    patients,
    isLoading: patientsLoading,
    error: patientsError,
    retry: retryPatients,
    removePatient,
    isRemovingPatient,
    removePatientError,
  } = useDietitianPatients();

  const {
    recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    removeRecommendation,
    editRecommendation,
    isMutating,
    retry: retryRecommendations,
  } = useDietitianRecommendations({ patientId });

  const overviewRequest = useApiRequest(
    ({ signal }) => getDietitianPatientOverview(patientId, { signal }),
    {
      manual: false,
      retries: 1,
      immediateParams: {
        patientId,
      },
    },
  );

  const patient = useMemo(
    () =>
      patients.find((item) => String(item.id) === String(patientId)) || null,
    [patientId, patients],
  );

  return {
    patient,
    overview: overviewRequest.data || null,
    recommendations,
    isLoading:
      patientsLoading || recommendationsLoading || overviewRequest.isLoading,
    patientsLoading,
    recommendationsLoading,
    overviewLoading: overviewRequest.isLoading,
    error: patientsError || recommendationsError || overviewRequest.error,
    patientsError,
    recommendationsError,
    overviewError: overviewRequest.error,
    retryPatients,
    retryRecommendations,
    retryOverview: overviewRequest.retry,
    removeRecommendation,
    editRecommendation,
    removePatient,
    isRemovingPatient,
    removePatientError,
    isMutating,
  };
}
