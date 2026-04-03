import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function mapProfileToForm(profile) {
  return {
    name: profile?.name || "",
    language: profile?.language || "en",
    age: profile?.age ?? "",
    height: profile?.height ?? "",
    weight: profile?.weight ?? "",
    goalType: profile?.goalType || "maintain",
    dailyCalorieGoal: profile?.dailyCalorieGoal ?? "",
    dietitianId: profile?.dietitianId || "",
  };
}

function toNumberOrUndefined(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function ProfileForm({ profile, isSubmitting, onSubmit }) {
  const { t } = useTranslation(["common", "profile"]);
  const [form, setForm] = useState(mapProfileToForm(profile));

  useEffect(() => {
    setForm(mapProfileToForm(profile));
  }, [profile]);

  const isDirty = useMemo(() => {
    const initial = mapProfileToForm(profile);

    return Object.keys(initial).some(
      (key) => String(initial[key]) !== String(form[key]),
    );
  }, [form, profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      name: form.name.trim(),
      language: form.language,
      age: toNumberOrUndefined(form.age),
      height: toNumberOrUndefined(form.height),
      weight: toNumberOrUndefined(form.weight),
      goalType: form.goalType,
      dailyCalorieGoal: toNumberOrUndefined(form.dailyCalorieGoal),
    });
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("profile:title")}</Typography>
            <Typography color="text.secondary">
              {t("profile:description")}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="name"
                label={t("profile:fields.name")}
                value={form.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                name="language"
                label={t("profile:fields.language")}
                value={form.language}
                onChange={handleChange}
              >
                <MenuItem value="en">{t("common:language.english")}</MenuItem>
                <MenuItem value="ua">{t("common:language.ukrainian")}</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                name="age"
                label={t("profile:fields.age")}
                value={form.age}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                name="height"
                label={t("profile:fields.height")}
                value={form.height}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                name="weight"
                label={t("profile:fields.weight")}
                value={form.weight}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                name="goalType"
                label={t("profile:fields.goalType")}
                value={form.goalType}
                onChange={handleChange}
              >
                <MenuItem value="lose">{t("profile:goals.lose")}</MenuItem>
                <MenuItem value="maintain">
                  {t("profile:goals.maintain")}
                </MenuItem>
                <MenuItem value="gain">{t("profile:goals.gain")}</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="dailyCalorieGoal"
                label={t("profile:fields.dailyCalorieGoal")}
                value={form.dailyCalorieGoal}
                onChange={handleChange}
              />
            </Grid>

            {form.dietitianId ? (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  disabled
                  name="dietitianId"
                  label={t("profile:fields.dietitianId")}
                  value={form.dietitianId}
                />
              </Grid>
            ) : null}
          </Grid>

          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting ? t("profile:saving") : t("profile:save")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
