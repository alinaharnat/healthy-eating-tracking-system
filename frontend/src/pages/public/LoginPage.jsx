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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";
import { resolvePostLoginPath } from "../../core/auth/redirects";
import { PATHS } from "../../router/paths";
import { validateAuthCredentials } from "../../shared/lib/validation/authValidation";
import { useNotification } from "../../shared/ui/notifications/useNotification";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const { t } = useTranslation(["auth", "validation", "notifications"]);
  const { notify } = useNotification();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from;

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
      const user = await login(form);
      const redirectPath = resolvePostLoginPath({
        role: user.role,
        fromPath,
      });

      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      const reason = submitError?.message || t("notifications:unknownError");

      setError(reason);

      notify({
        key: "auth.loginFailed",
        values: { reason },
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t("auth:login.title")}</Typography>

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
            autoComplete="current-password"
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
          />

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? t("auth:login.submitting") : t("auth:login.submit")}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {t("auth:login.noAccount")}{" "}
        <Link to={PATHS.register}>{t("auth:login.createOne")}</Link>
      </Typography>
    </Stack>
  );
}

export default LoginPage;
