import { useCallback, useState } from "react";
import i18n from "../../../core/i18n/i18n";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { exportDatabase, importDatabase } from "../api";

function downloadJsonFile(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

export function useAdminBackupData() {
  const [successMessage, setSuccessMessage] = useState("");
  const [fileError, setFileError] = useState(null);

  const exportRequest = useApiRequest(
    ({ signal }) => exportDatabase({ signal }),
    {
      manual: true,
      retries: 1,
    },
  );

  const importRequest = useApiRequest(
    ({ payload, signal }) => importDatabase(payload, { signal }),
    {
      manual: true,
    },
  );

  const exportRun = exportRequest.run;
  const importRun = importRequest.run;

  const handleExport = useCallback(async () => {
    setFileError(null);
    const data = await exportRun({});
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadJsonFile(data, `macro-backup-${timestamp}.json`);
    setSuccessMessage(i18n.t("admin:feedback.backupExported"));
  }, [exportRun]);

  const handleImport = useCallback(
    async (file) => {
      setFileError(null);

      const text = await file.text();
      let payload;

      try {
        payload = JSON.parse(text);
      } catch {
        const message = i18n.t("admin:feedback.invalidJsonFile");
        setFileError(new Error(message));
        throw new Error(message);
      }

      const response = await importRun({ payload });
      setSuccessMessage(
        response?.message || i18n.t("admin:feedback.importCompleted"),
      );
      return response;
    },
    [importRun],
  );

  return {
    handleExport,
    handleImport,
    isExporting: exportRequest.isLoading,
    isImporting: importRequest.isLoading,
    error: fileError || exportRequest.error || importRequest.error || null,
    successMessage,
    clearSuccessMessage: () => setSuccessMessage(""),
  };
}
