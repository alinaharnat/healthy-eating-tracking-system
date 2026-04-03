import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../core/i18n/useLocale";
import { formatLocalizedDateTime } from "../../../shared/lib/format/dateTime";
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";

function ReportsList({ reports, onCreate, onDelete, isMutating }) {
  const { t } = useTranslation("reports");
  const { language } = useLocale();
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fileUrl.trim()) {
      return;
    }

    await onCreate({ fileUrl: fileUrl.trim() });
    setFileUrl("");
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack component="form" spacing={1.5} onSubmit={handleSubmit}>
            <Typography variant="subtitle1">{t("createTitle")}</Typography>
            <TextField
              label={t("fileUrl")}
              value={fileUrl}
              onChange={(event) => setFileUrl(event.target.value)}
              placeholder="https://..."
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={isMutating}>
              {t("addAction")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {!reports.length ? (
        <EmptyStateCard
          title={t("empty")}
          description={t("emptyDescription")}
        />
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <CardContent>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {formatLocalizedDateTime(report.createdAt, { language })}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(report.id)}
                    disabled={isMutating}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Link
                  href={report.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {report.fileUrl}
                  <OpenInNewIcon fontSize="inherit" />
                </Link>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}

export default ReportsList;
