import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function MealItemsList({
  items,
  onRemoveItem,
  onUpdateItemWeight,
  disabled = false,
}) {
  const { t } = useTranslation("meals");

  if (!items.length) {
    return (
      <Typography color="text.secondary">{t("form.emptyProducts")}</Typography>
    );
  }

  return (
    <List disablePadding>
      {items.map((item, index) => (
        <ListItem
          key={`${item.itemId || item.productId || item.productName}-${index}`}
          disablePadding
          sx={{ py: 1 }}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => onRemoveItem(index)}
              disabled={disabled}
            >
              <DeleteOutlineIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={item.productName || t("form.unknownProduct")}
            secondary={
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 0.25 }}
              >
                <Chip
                  size="small"
                  color={item.source === "custom" ? "secondary" : "default"}
                  label={
                    item.source === "custom"
                      ? t("form.source.custom")
                      : t("form.source.catalog")
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  {item.weightGrams} g
                </Typography>
              </Stack>
            }
          />

          <TextField
            type="number"
            size="small"
            label={t("form.custom.grams")}
            value={item.weightGrams}
            inputProps={{ min: 1 }}
            onChange={(event) =>
              onUpdateItemWeight(index, Number(event.target.value))
            }
            disabled={disabled}
            sx={{ width: 140, mr: 1 }}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default MealItemsList;
