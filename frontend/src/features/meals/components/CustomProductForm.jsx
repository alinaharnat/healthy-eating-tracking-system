import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_CUSTOM_PRODUCT = {
  name: "",
  calories: "",
  proteins: "",
  fats: "",
  carbs: "",
  grams: "100",
};

function CustomProductForm({ onAddCustomProduct, disabled = false }) {
  const { t } = useTranslation("meals");
  const [form, setForm] = useState(INITIAL_CUSTOM_PRODUCT);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    const parsed = {
      name: String(form.name || "").trim(),
      calories: Number(form.calories),
      proteins: Number(form.proteins),
      fats: Number(form.fats),
      carbs: Number(form.carbs),
      grams: Number(form.grams),
    };

    const isInvalid =
      !parsed.name ||
      !Number.isFinite(parsed.calories) ||
      !Number.isFinite(parsed.proteins) ||
      !Number.isFinite(parsed.fats) ||
      !Number.isFinite(parsed.carbs) ||
      !Number.isFinite(parsed.grams) ||
      parsed.calories < 0 ||
      parsed.proteins < 0 ||
      parsed.fats < 0 ||
      parsed.carbs < 0 ||
      parsed.grams <= 0;

    if (isInvalid) {
      return;
    }

    onAddCustomProduct({
      source: "custom",
      productId: null,
      productName: parsed.name,
      customProduct: {
        name: parsed.name,
        calories: parsed.calories,
        proteins: parsed.proteins,
        fats: parsed.fats,
        carbs: parsed.carbs,
      },
      weightGrams: parsed.grams,
      calories: (parsed.calories * parsed.grams) / 100,
      proteins: (parsed.proteins * parsed.grams) / 100,
      fats: (parsed.fats * parsed.grams) / 100,
      carbs: (parsed.carbs * parsed.grams) / 100,
    });

    setForm(INITIAL_CUSTOM_PRODUCT);
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{t("form.customProducts")}</Typography>

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label={t("form.custom.name")}
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
            label={t("form.custom.calories")}
            name="calories"
            value={form.calories}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
            label={t("form.custom.proteins")}
            name="proteins"
            value={form.proteins}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
            label={t("form.custom.fats")}
            name="fats"
            value={form.fats}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
            label={t("form.custom.carbs")}
            name="carbs"
            value={form.carbs}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 1 }}
            label={t("form.custom.grams")}
            name="grams"
            value={form.grams}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAdd}
            disabled={disabled}
          >
            {t("form.custom.add")}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default CustomProductForm;
