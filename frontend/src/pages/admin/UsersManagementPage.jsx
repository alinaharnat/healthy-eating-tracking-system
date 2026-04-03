import { Alert, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../features/admin/components/ConfirmationDialog";
import RoleChangeDialog from "../../features/admin/components/RoleChangeDialog";
import UsersTable from "../../features/admin/components/UsersTable";
import { useAdminUsersManagement } from "../../features/admin/hooks/useAdminUsersManagement";
import { useLocale } from "../../core/i18n/useLocale";
import { sortByLocale } from "../../shared/lib/sort/localeSort";
import { PATHS } from "../../router/paths";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";

function UsersManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { language } = useLocale();
  const navigate = useNavigate();

  const {
    users,
    isLoading,
    error,
    retry,
    updateRole,
    block,
    unblock,
    successMessage,
    clearSuccessMessage,
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

      {successMessage ? (
        <Alert severity="success" onClose={clearSuccessMessage}>
          {successMessage}
        </Alert>
      ) : null}

      {mutationError ? (
        <Alert severity="error">{mutationError.message}</Alert>
      ) : null}

      <TextField
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        label={t("users.search")}
        size="small"
        sx={{ maxWidth: 320 }}
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
