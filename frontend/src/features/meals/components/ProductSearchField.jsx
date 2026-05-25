import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { createCatalogDraftItem } from "../lib/mealDraft";
import { searchProducts } from "../../products/api";

function ProductSearchField({ onAddProduct, disabled = false }) {
  const { t } = useTranslation(["meals", "products"]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weightGrams, setWeightGrams] = useState(100);
  const [fieldError, setFieldError] = useState("");

  const searchRequest = useApiRequest(
    ({ searchText, signal }) =>
      searchProducts(
        {
          search: searchText,
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
    const query = searchInput.trim();

    if (!query) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchRun({ searchText: query }).catch(() => null);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput, searchRun]);

  const options = useMemo(() => searchRequest.data || [], [searchRequest.data]);

  const handleAdd = () => {
    if (!selectedProduct) {
      setFieldError(t("meals:form.validation.selectProduct"));
      return;
    }

    const parsedWeight = Number(weightGrams);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      setFieldError(t("meals:form.validation.positiveWeight"));
      return;
    }

    setFieldError("");

    onAddProduct(createCatalogDraftItem(selectedProduct, parsedWeight));

    setSelectedProduct(null);
    setSearchInput("");
    setWeightGrams(100);
  };

  const handleInputChange = (_, value) => {
    setSearchInput(value);

    if (fieldError) {
      setFieldError("");
    }
  };

  const handleWeightChange = (event) => {
    setWeightGrams(event.target.value);

    if (fieldError) {
      setFieldError("");
    }
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">
        {t("meals:form.catalogProducts")}
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <Autocomplete
          fullWidth
          value={selectedProduct}
          onChange={(_, product) => setSelectedProduct(product)}
          inputValue={searchInput}
          onInputChange={handleInputChange}
          options={options}
          loading={searchRequest.isLoading}
          getOptionLabel={(option) => option.name || ""}
          filterOptions={(items) => items}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText={t("products:empty")}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("meals:productDialog.searchLabel")}
              placeholder={t("meals:productDialog.searchPlaceholder")}
              error={Boolean(fieldError)}
              helperText={fieldError || " "}
            />
          )}
        />

        <TextField
          type="number"
          label={t("meals:productDialog.weightLabel")}
          value={weightGrams}
          inputProps={{ min: 1 }}
          onChange={handleWeightChange}
          disabled={disabled}
          sx={{ width: { xs: "100%", md: 180 } }}
        />

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAdd}
          disabled={disabled || !selectedProduct}
        >
          {t("meals:form.addProduct")}
        </Button>
      </Stack>
    </Stack>
  );
}

export default ProductSearchField;
