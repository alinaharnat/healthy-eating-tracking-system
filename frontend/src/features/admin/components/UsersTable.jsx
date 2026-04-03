import HistoryIcon from "@mui/icons-material/History";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getLocalizedApiErrorMessage } from "../../../shared/lib/errors/getLocalizedApiErrorMessage";
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../../shared/ui/states/SectionLoadingState";
import BlockUnblockActions from "./BlockUnblockActions";

function UsersTable({
  users,
  isLoading,
  error,
  onRetry,
  onOpenRoleDialog,
  onBlock,
  onUnblock,
  onOpenActivity,
  isMutating,
}) {
  const { t } = useTranslation(["admin", "common"]);

  if (error) {
    return (
      <SectionErrorState
        message={getLocalizedApiErrorMessage(error, t)}
        onRetry={onRetry}
        retryLabel={t("common:actions.retry")}
      />
    );
  }

  if (isLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  if (!users.length) {
    return (
      <EmptyStateCard
        title={t("users.empty")}
        description={t("users.emptyDescription")}
      />
    );
  }

  return (
    <Paper sx={{ p: 2, overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("users.columns.name")}</TableCell>
            <TableCell>{t("users.columns.email")}</TableCell>
            <TableCell>{t("users.columns.role")}</TableCell>
            <TableCell>{t("users.columns.status")}</TableCell>
            <TableCell align="right">{t("users.columns.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip size="small" label={t(`roles.${user.role}`)} />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={user.isActive ? "success" : "default"}
                  label={
                    user.isActive ? t("status.active") : t("status.blocked")
                  }
                />
              </TableCell>
              <TableCell align="right">
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={0.5}
                  justifyContent="flex-end"
                  alignItems={{ xs: "flex-end", md: "center" }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ManageAccountsIcon />}
                    onClick={() => onOpenRoleDialog(user)}
                    disabled={isMutating}
                  >
                    {t("actions.changeRole")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    onClick={() => onOpenActivity(user)}
                    disabled={isMutating}
                  >
                    {t("actions.viewActivity")}
                  </Button>
                  <BlockUnblockActions
                    user={user}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                    isSubmitting={isMutating}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default UsersTable;
