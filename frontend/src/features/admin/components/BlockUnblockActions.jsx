import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

function BlockUnblockActions({
  user,
  onBlock,
  onUnblock,
  isSubmitting = false,
}) {
  const { t } = useTranslation("admin");

  if (!user) {
    return null;
  }

  return user.isActive ? (
    <Stack direction="row" justifyContent="flex-end">
      <Button
        size="small"
        color="warning"
        startIcon={<BlockIcon />}
        onClick={() => onBlock(user)}
        disabled={isSubmitting}
      >
        {t("actions.block")}
      </Button>
    </Stack>
  ) : (
    <Stack direction="row" justifyContent="flex-end">
      <Button
        size="small"
        color="success"
        startIcon={<LockOpenIcon />}
        onClick={() => onUnblock(user)}
        disabled={isSubmitting}
      >
        {t("actions.unblock")}
      </Button>
    </Stack>
  );
}

export default BlockUnblockActions;
