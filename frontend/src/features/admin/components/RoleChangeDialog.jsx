import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ROLE_VALUES } from "../../../core/auth/constants";

function RoleChangeDialog({
  open,
  user,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const { t } = useTranslation("admin");
  const [role, setRole] = useState(user?.role || "client");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      return;
    }

    await onSubmit({ userId: user.id, role });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t("dialogs.roleChange.title")}</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              value={user?.name || ""}
              label={t("users.columns.name")}
              disabled
              fullWidth
            />
            <TextField
              value={user?.email || ""}
              label={t("users.columns.email")}
              disabled
              fullWidth
            />
            <TextField
              select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              label={t("users.columns.role")}
              fullWidth
            >
              {ROLE_VALUES.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`roles.${value}`)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? t("actions.saving") : t("actions.save")}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

export default RoleChangeDialog;
