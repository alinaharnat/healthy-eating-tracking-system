import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { searchProducts } from "../../products/api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

function ProductSearchDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation(["meals", "products", "common"]);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weightGrams, setWeightGrams] = useState(100);

  const searchRequest = useApiRequest(
    ({ search, signal }) =>
      searchProducts(
        {
          search,
        },
        { signal },
      ),
    {
      manual: true,
      retries: 1,
    },
  );

  const searchRun = searchRequest.run;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!query.trim()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchRun({ search: query.trim() }).catch(() => null);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open, query, searchRun]);

  const options = useMemo(() => searchRequest.data || [], [searchRequest.data]);

  const handleClose = () => {
    setQuery("");
    setSelectedProduct(null);
    setWeightGrams(100);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedProduct) {
      return;
    }

    onConfirm({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      weightGrams: Number(weightGrams) || 100,
    });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("meals:productDialog.title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Autocomplete
            value={selectedProduct}
            onChange={(_, product) => setSelectedProduct(product)}
            options={options}
            loading={searchRequest.isLoading}
            getOptionLabel={(option) => option.name || ""}
            noOptionsText={t("products:empty")}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("meals:productDialog.searchLabel")}
                placeholder={t("meals:productDialog.searchPlaceholder")}
                onChange={(event) => setQuery(event.target.value)}
              />
            )}
          />

          <TextField
            label={t("meals:productDialog.weightLabel")}
            type="number"
            inputProps={{ min: 1 }}
            value={weightGrams}
            onChange={(event) => setWeightGrams(event.target.value)}
          />

          {selectedProduct ? (
            <Typography variant="body2" color="text.secondary">
              {selectedProduct.name}: {selectedProduct.calories} kcal / 100g
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("common:actions.cancel")}</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedProduct}
        >
          {t("meals:productDialog.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductSearchDialog;
