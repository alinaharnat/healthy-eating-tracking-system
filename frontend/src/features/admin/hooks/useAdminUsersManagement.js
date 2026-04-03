import { useCallback, useMemo, useState } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { blockUser, changeUserRole, getAllUsers, unblockUser } from "../api";

export function useAdminUsersManagement() {
  const [successKey, setSuccessKey] = useState("");

  const usersRequest = useApiRequest(({ signal }) => getAllUsers({ signal }), {
    manual: false,
    retries: 1,
  });

  const roleRequest = useApiRequest(
    ({ userId, role, signal }) => changeUserRole(userId, role, { signal }),
    { manual: true },
  );

  const blockRequest = useApiRequest(
    ({ userId, signal }) => blockUser(userId, { signal }),
    { manual: true },
  );

  const unblockRequest = useApiRequest(
    ({ userId, signal }) => unblockUser(userId, { signal }),
    { manual: true },
  );

  const usersRun = usersRequest.run;
  const roleRun = roleRequest.run;
  const blockRun = blockRequest.run;
  const unblockRun = unblockRequest.run;

  const reload = useCallback(async () => {
    await usersRun({});
  }, [usersRun]);

  const updateRole = useCallback(
    async ({ userId, role }) => {
      const result = await roleRun({ userId, role });
      setSuccessKey("feedback.roleUpdated");
      await reload();
      return result;
    },
    [reload, roleRun],
  );

  const block = useCallback(
    async (userId) => {
      const result = await blockRun({ userId });
      setSuccessKey("feedback.userBlocked");
      await reload();
      return result;
    },
    [blockRun, reload],
  );

  const unblock = useCallback(
    async (userId) => {
      const result = await unblockRun({ userId });
      setSuccessKey("feedback.userUnblocked");
      await reload();
      return result;
    },
    [reload, unblockRun],
  );

  const users = useMemo(() => usersRequest.data || [], [usersRequest.data]);

  return {
    users,
    isLoading: usersRequest.isLoading,
    error: usersRequest.error,
    retry: usersRequest.retry,
    reload,
    updateRole,
    block,
    unblock,
    successKey,
    clearSuccessKey: () => setSuccessKey(""),
    mutationError:
      roleRequest.error || blockRequest.error || unblockRequest.error || null,
    isMutating:
      roleRequest.isLoading ||
      blockRequest.isLoading ||
      unblockRequest.isLoading,
  };
}
