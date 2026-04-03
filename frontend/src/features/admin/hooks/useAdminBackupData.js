import { useCallback, useState } from "react";
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
  const [successKey, setSuccessKey] = useState("");
  const [fileErrorKey, setFileErrorKey] = useState("");

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
    setFileErrorKey("");
    const data = await exportRun({});
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadJsonFile(data, `macro-backup-${timestamp}.json`);
    setSuccessKey("feedback.backupExported");
  }, [exportRun]);

  const handleImport = useCallback(
    async (file) => {
      setFileErrorKey("");

      const text = await file.text();
      let payload;

      try {
        payload = JSON.parse(text);
      } catch {
        setFileErrorKey("feedback.invalidJsonFile");
        throw new Error("Invalid JSON file format");
      }

      const response = await importRun({ payload });
      setSuccessKey("feedback.importCompleted");
      return response;
    },
    [importRun],
  );

  return {
    handleExport,
    handleImport,
    isExporting: exportRequest.isLoading,
    isImporting: importRequest.isLoading,
    error: exportRequest.error || importRequest.error || null,
    fileErrorKey,
    clearFileErrorKey: () => setFileErrorKey(""),
    successKey,
    clearSuccessKey: () => setSuccessKey(""),
  };
}
