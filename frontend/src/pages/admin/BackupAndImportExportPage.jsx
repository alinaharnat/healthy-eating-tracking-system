import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import ImportExportControls from "../../features/admin/components/ImportExportControls";
import { useAdminBackupData } from "../../features/admin/hooks/useAdminBackupData";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";

function BackupAndImportExportPage() {
  const { t } = useTranslation("admin");

  const {
    handleExport,
    handleImport,
    isExporting,
    isImporting,
    error,
    successMessage,
  } = useAdminBackupData();

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
        error={error}
        successMessage={successMessage}
      />
    </Stack>
  );
}

export default BackupAndImportExportPage;
