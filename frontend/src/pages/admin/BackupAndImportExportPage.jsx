import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ImportExportControls from "../../features/admin/components/ImportExportControls";
import { useAdminBackupData } from "../../features/admin/hooks/useAdminBackupData";
import { getLocalizedApiErrorMessage } from "../../shared/lib/errors/getLocalizedApiErrorMessage";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";

function BackupAndImportExportPage() {
  const { t } = useTranslation("admin");
  const { notify } = useNotification();

  const {
    handleExport,
    handleImport,
    isExporting,
    isImporting,
    error,
    fileErrorKey,
    clearFileErrorKey,
    successKey,
    clearSuccessKey,
  } = useAdminBackupData();

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
    if (!fileErrorKey) {
      return;
    }

    notify({
      key: fileErrorKey,
      namespace: "admin",
      severity: "warning",
    });

    clearFileErrorKey();
  }, [clearFileErrorKey, fileErrorKey, notify]);

  useEffect(() => {
    if (!error) {
      return;
    }

    notify({
      message: getLocalizedApiErrorMessage(error, t),
      severity: "error",
    });
  }, [error, notify, t]);

  return (
    <Stack spacing={2.5}>
      <PageHeaderCard
        title={t("backup.title")}
        description={t("backup.description")}
      />

      <ImportExportControls
        onExport={handleExport}
        onImport={handleImport}
        isExporting={isExporting}
        isImporting={isImporting}
      />
    </Stack>
  );
}

export default BackupAndImportExportPage;
