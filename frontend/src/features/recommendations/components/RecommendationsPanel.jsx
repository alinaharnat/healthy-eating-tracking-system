import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../core/i18n/useLocale";
import { formatLocalizedDateTime } from "../../../shared/lib/format/dateTime";
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";

function RecommendationsPanel({
  recommendations,
  onDelete,
  onGenerate,
  isMutating,
}) {
  const { t } = useTranslation("recommendations");
  const { language } = useLocale();

  if (!recommendations.length) {
    return (
      <EmptyStateCard
        title={t("empty")}
        description={t("emptyDescription")}
        actionLabel={t("generateAction")}
        onAction={onGenerate}
      />
    );
  }

  return (
    <Stack spacing={2}>
      {recommendations.map((item) => (
        <Card key={item.id}>
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TipsAndUpdatesIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2">
                    {formatLocalizedDateTime(item.createdAt, { language })}
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => onDelete(item.id)}
                  disabled={isMutating}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Typography>{item.message}</Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default RecommendationsPanel;
