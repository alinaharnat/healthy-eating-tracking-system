import { useMemo } from "react";
import { useDietitianPatients } from "./useDietitianPatients";
import { useDietitianRecommendations } from "./useDietitianRecommendations";

export function usePatientDetailsData(patientId) {
  const {
    patients,
    isLoading: patientsLoading,
    error: patientsError,
    retry: retryPatients,
  } = useDietitianPatients();

  const {
    recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    removeRecommendation,
    isMutating,
    retry: retryRecommendations,
  } = useDietitianRecommendations({ patientId });

  const patient = useMemo(
    () =>
      patients.find((item) => String(item.id) === String(patientId)) || null,
    [patientId, patients],
  );

  return {
    patient,
    recommendations,
    isLoading: patientsLoading || recommendationsLoading,
    patientsLoading,
    recommendationsLoading,
    error: patientsError || recommendationsError,
    patientsError,
    recommendationsError,
    retryPatients,
    retryRecommendations,
    removeRecommendation,
    isMutating,
  };
}
