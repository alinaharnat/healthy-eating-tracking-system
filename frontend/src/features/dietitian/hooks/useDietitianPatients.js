import { useMemo } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { listAssignedPatients } from "../api";

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

  return {
    patients,
    isLoading: patientsRequest.isLoading,
    error: patientsRequest.error,
    retry: patientsRequest.retry,
    reload: patientsRequest.run,
  };
}
