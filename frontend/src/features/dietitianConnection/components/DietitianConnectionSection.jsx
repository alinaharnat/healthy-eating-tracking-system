import SearchIcon from "@mui/icons-material/Search";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  Alert,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import JoinRequestStatusCard from "./JoinRequestStatusCard";

function DietitianConnectionSection({
  me,
  dietitians,
  pendingRequest,
  latestResolvedRequest,
  canSendRequest,
  onSendRequest,
  onCancelRequest,
  isMutating,
  createError,
  cancelError,
}) {
  const { t } = useTranslation("profile");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const filteredDietitians = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return dietitians;
    }

    return dietitians.filter((item) => {
      return (
        item.name?.toLowerCase().includes(normalizedSearch) ||
        item.email?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [dietitians, search]);

  const handleSendRequest = async (dietitianId) => {
    await onSendRequest({
      dietitianId,
      message: message.trim(),
    });

    setMessage("");
  };

  return (
    <Stack spacing={2}>
      {createError ? (
        <Alert severity="error">{createError.message}</Alert>
      ) : null}
      {cancelError ? (
        <Alert severity="error">{cancelError.message}</Alert>
      ) : null}

      <JoinRequestStatusCard
        me={me}
        pendingRequest={pendingRequest}
        latestResolvedRequest={latestResolvedRequest}
        onCancelRequest={onCancelRequest}
        isMutating={isMutating}
      />

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">
              {t("dietitianConnection.search.title")}
            </Typography>
            <Typography color="text.secondary">
              {t("dietitianConnection.search.description")}
            </Typography>

            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              label={t("dietitianConnection.search.field")}
              placeholder={t("dietitianConnection.search.placeholder")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              multiline
              minRows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              label={t("dietitianConnection.search.requestMessage")}
              placeholder={t(
                "dietitianConnection.search.requestMessagePlaceholder",
              )}
              disabled={!canSendRequest || isMutating}
            />

            {!filteredDietitians.length ? (
              <Typography color="text.secondary">
                {t("dietitianConnection.search.empty")}
              </Typography>
            ) : (
              <Stack spacing={1}>
                {filteredDietitians.map((dietitian) => (
                  <Card key={dietitian.id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Stack spacing={0.2}>
                          <Typography variant="subtitle2">
                            {dietitian.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dietitian.email}
                          </Typography>
                        </Stack>

                        <Button
                          variant="contained"
                          startIcon={<SendOutlinedIcon />}
                          onClick={() => handleSendRequest(dietitian.id)}
                          disabled={!canSendRequest || isMutating}
                        >
                          {t("dietitianConnection.actions.sendRequest")}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default DietitianConnectionSection;
