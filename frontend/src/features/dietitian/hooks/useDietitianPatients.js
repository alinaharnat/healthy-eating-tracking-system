import { useMemo } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { listAssignedPatients, unassignDietitianPatient } from "../api";
import { useCallback } from "react";

export function useDietitianPatients() {
  const patientsRequest = useApiRequest(
    ({ signal }) => listAssignedPatients({ signal }),
    {
      manual: false,
      retries: 1,
    },
  );

  const patients = useMemo(
    () => patientsRequest.data || [],
    [patientsRequest.data],
  );

  const unassignRequest = useApiRequest(
    ({ patientId, signal }) => unassignDietitianPatient(patientId, { signal }),
    {
      manual: true,
    },
  );

  const unassignRun = unassignRequest.run;
  const reloadRun = patientsRequest.run;

  const removePatient = useCallback(
    async (patientId) => {
      const result = await unassignRun({ patientId });
      await reloadRun({});
      return result;
    },
    [reloadRun, unassignRun],
  );

  return {
    patients,
    isLoading: patientsRequest.isLoading,
    error: patientsRequest.error,
    retry: patientsRequest.retry,
    reload: patientsRequest.run,
    removePatient,
    removePatientError: unassignRequest.error,
    isRemovingPatient: unassignRequest.isLoading,
  };
}
