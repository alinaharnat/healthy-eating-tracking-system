import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

function ImportExportControls({
  onExport,
  onImport,
  isExporting,
  isImporting,
}) {
  const { t } = useTranslation("admin");
  const inputRef = useRef(null);

  const handleTriggerUpload = () => {
    inputRef.current?.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await onImport(file);
    } catch {
      // Error is surfaced by parent hook state.
    }
    event.target.value = "";
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t("backup.controlsTitle")}</Typography>
            <Typography color="text.secondary">
              {t("backup.controlsDescription")}
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={onExport}
              disabled={isExporting || isImporting}
            >
              {isExporting
                ? t("backup.actions.exporting")
                : t("backup.actions.export")}
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={handleTriggerUpload}
              disabled={isExporting || isImporting}
            >
              {isImporting
                ? t("backup.actions.importing")
                : t("backup.actions.import")}
            </Button>

            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleFileSelected}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ImportExportControls;
