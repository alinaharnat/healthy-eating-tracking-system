import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../core/i18n/useLocale";
import { formatLocalizedDateTime } from "../../../shared/lib/format/dateTime";
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";

function MealList({ meals, onCreate, onEdit, onDelete, isMutating }) {
  const { t } = useTranslation(["meals", "common"]);
  const { language } = useLocale();

  if (!meals.length) {
    return (
      <EmptyStateCard
        title={t("meals:empty")}
        description={t("meals:list.emptyDescription")}
        actionLabel={t("meals:list.createFirst")}
        onAction={onCreate}
      />
    );
  }

  return (
    <Stack spacing={2}>
      {meals.map((meal) => (
        <Card key={meal.id}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">
                    {t(`meals:types.${meal.mealType}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatLocalizedDateTime(meal.date, { language })}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => onEdit(meal)}
                    disabled={isMutating}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(meal.id)}
                    disabled={isMutating}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider />

              {meal.mealProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t("meals:list.noProducts")}
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {meal.mealProducts.map((product, index) => (
                    <Stack
                      key={`${meal.id}-${product.itemId || product.productId || index}`}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Stack>
                        <Typography variant="body2">
                          {product.productName ||
                            t("meals:form.unknownProduct")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.weightGrams} g
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          color={
                            product.source === "custom"
                              ? "secondary"
                              : "default"
                          }
                          label={
                            product.source === "custom"
                              ? t("meals:form.source.custom")
                              : t("meals:form.source.catalog")
                          }
                        />
                        <Chip size="small" label={`${product.weightGrams} g`} />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default MealList;
