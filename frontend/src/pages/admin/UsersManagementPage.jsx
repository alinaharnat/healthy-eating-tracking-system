import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../core/i18n/useLocale";
import AdminSearchField from "../../features/admin/components/AdminSearchField";
import ConfirmationDialog from "../../features/admin/components/ConfirmationDialog";
import RoleChangeDialog from "../../features/admin/components/RoleChangeDialog";
import UsersTable from "../../features/admin/components/UsersTable";
import { useAdminUsersManagement } from "../../features/admin/hooks/useAdminUsersManagement";
import { getLocalizedApiErrorMessage } from "../../shared/lib/errors/getLocalizedApiErrorMessage";
import { sortByLocale } from "../../shared/lib/sort/localeSort";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import { PATHS } from "../../router/paths";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";

function UsersManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { language } = useLocale();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const {
    users,
    isLoading,
    error,
    retry,
    updateRole,
    block,
    unblock,
    successKey,
    clearSuccessKey,
    mutationError,
    isMutating,
  } = useAdminUsersManagement();

  const [search, setSearch] = useState("");
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [pendingStatusAction, setPendingStatusAction] = useState(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = query
      ? users.filter((user) => {
          return (
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
          );
        })
      : users;

    return sortByLocale(list, (user) => user.name, language);
  }, [language, search, users]);

  const handleOpenActivity = (user) => {
    navigate(PATHS.admin.userActivity(user.id));
  };

  useEffect(() => {
    if (!successKey) {
      return;
    }

    notify({
      key: successKey,
      namespace: "admin",
      severity: "success",
    });

    clearSuccessKey();
  }, [clearSuccessKey, notify, successKey]);

  useEffect(() => {
    if (!mutationError) {
      return;
    }

    notify({
      message: getLocalizedApiErrorMessage(mutationError, t),
      severity: "error",
    });
  }, [mutationError, notify, t]);

  const handleConfirmStatusAction = async () => {
    if (!pendingStatusAction?.user?.id) {
      return;
    }

    if (pendingStatusAction.type === "block") {
      await block(pendingStatusAction.user.id);
    } else {
      await unblock(pendingStatusAction.user.id);
    }

    setPendingStatusAction(null);
  };

  return (
    <Stack spacing={2.5}>
      <PageHeaderCard
        title={t("users.title")}
        description={t("users.description")}
      />

      <AdminSearchField
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        label={t("users.search")}
      />

      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        onOpenRoleDialog={setRoleDialogUser}
        onBlock={(user) => setPendingStatusAction({ type: "block", user })}
        onUnblock={(user) => setPendingStatusAction({ type: "unblock", user })}
        onOpenActivity={handleOpenActivity}
        isMutating={isMutating}
      />

      {roleDialogUser ? (
        <RoleChangeDialog
          key={roleDialogUser.id}
          open={Boolean(roleDialogUser)}
          user={roleDialogUser}
          onClose={() => setRoleDialogUser(null)}
          onSubmit={async ({ userId, role }) => {
            await updateRole({ userId, role });
            setRoleDialogUser(null);
          }}
          isSubmitting={isMutating}
        />
      ) : null}

      <ConfirmationDialog
        open={Boolean(pendingStatusAction)}
        title={
          pendingStatusAction?.type === "block"
            ? t("dialogs.block.title")
            : t("dialogs.unblock.title")
        }
        description={
          pendingStatusAction?.type === "block"
            ? t("dialogs.block.description", {
                name: pendingStatusAction?.user?.name || "",
              })
            : t("dialogs.unblock.description", {
                name: pendingStatusAction?.user?.name || "",
              })
        }
        confirmLabel={
          pendingStatusAction?.type === "block"
            ? t("actions.block")
            : t("actions.unblock")
        }
        cancelLabel={t("actions.cancel")}
        onConfirm={handleConfirmStatusAction}
        onClose={() => setPendingStatusAction(null)}
        isSubmitting={isMutating}
        confirmColor={
          pendingStatusAction?.type === "block" ? "warning" : "success"
        }
      />
    </Stack>
  );
}

export default UsersManagementPage;
