import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";
import { getDefaultRouteForRole } from "../../core/auth/redirects";
import { PATHS } from "../../router/paths";
import { validateAuthCredentials } from "../../shared/lib/validation/authValidation";
import { useNotification } from "../../shared/ui/notifications/useNotification";

function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const { t } = useTranslation(["auth", "validation", "notifications"]);
  const { notify } = useNotification();

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateAuthCredentials(form, t);
    setFieldErrors(validationErrors);

    if (validationErrors.email || validationErrors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register(form);
      navigate(getDefaultRouteForRole(user.role), { replace: true });
    } catch (submitError) {
      const reason = submitError?.message || t("notifications:unknownError");

      setError(reason);

      notify({
        key: "auth.registerFailed",
        values: { reason },
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t("auth:register.title")}</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            name="email"
            label={t("auth:fields.email")}
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />

          <TextField
            name="password"
            label={t("auth:fields.password")}
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
          />

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting
              ? t("auth:register.submitting")
              : t("auth:register.submit")}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {t("auth:register.alreadyRegistered")}{" "}
        <Link to={PATHS.login}>{t("auth:register.signIn")}</Link>
      </Typography>
    </Stack>
  );
}

export default RegisterPage;
