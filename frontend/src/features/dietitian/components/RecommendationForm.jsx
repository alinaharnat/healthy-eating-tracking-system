import {
  Alert,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function RecommendationForm({
  patients,
  initialPatientId,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}) {
  const { t } = useTranslation("dietitian");
  const [userId, setUserId] = useState(initialPatientId || "");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!userId || !message.trim()) {
      setValidationError(t("form.validation.required"));
      return;
    }

    await onSubmit({
      userId,
      message: message.trim(),
    });

    setMessage("");
  };

  return (
    <Card>
      <CardContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t("form.title")}</Typography>
            <Typography color="text.secondary">
              {t("form.description")}
            </Typography>
          </Stack>

          {validationError ? (
            <Alert severity="warning">{validationError}</Alert>
          ) : null}
          {error ? <Alert severity="error">{error.message}</Alert> : null}

          <TextField
            select
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            label={t("form.patient")}
            required
            fullWidth
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} ({patient.email})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            multiline
            minRows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            label={t("form.message")}
            placeholder={t("form.messagePlaceholder")}
            required
            fullWidth
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            {onCancel ? (
              <Button onClick={onCancel}>{t("actions.cancel")}</Button>
            ) : null}
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? t("actions.saving") : t("actions.save")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RecommendationForm;
