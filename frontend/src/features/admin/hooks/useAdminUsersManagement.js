import { useCallback, useMemo, useState } from "react";
import i18n from "../../../core/i18n/i18n";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { blockUser, changeUserRole, getAllUsers, unblockUser } from "../api";

export function useAdminUsersManagement() {
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage(
        result?.message || i18n.t("admin:feedback.roleUpdated"),
      );
      await reload();
      return result;
    },
    [reload, roleRun],
  );

  const block = useCallback(
    async (userId) => {
      const result = await blockRun({ userId });
      setSuccessMessage(
        result?.message || i18n.t("admin:feedback.userBlocked"),
      );
      await reload();
      return result;
    },
    [blockRun, reload],
  );

  const unblock = useCallback(
    async (userId) => {
      const result = await unblockRun({ userId });
      setSuccessMessage(
        result?.message || i18n.t("admin:feedback.userUnblocked"),
      );
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
    successMessage,
    clearSuccessMessage: () => setSuccessMessage(""),
    mutationError:
      roleRequest.error || blockRequest.error || unblockRequest.error || null,
    isMutating:
      roleRequest.isLoading ||
      blockRequest.isLoading ||
      unblockRequest.isLoading,
  };
}
