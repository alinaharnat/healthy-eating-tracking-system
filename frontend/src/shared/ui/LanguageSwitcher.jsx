import TranslateIcon from "@mui/icons-material/Translate";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../core/i18n/useLocale";
import { useNotification } from "./notifications/useNotification";

const WHITE_VARIANT_SX = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "common.white",
    "& fieldset": {
      borderColor: "rgba(15, 23, 42, 0.28)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(15, 23, 42, 0.48)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: 1,
    },
  },
  "& .MuiInputBase-input": {
    color: "text.primary",
  },
  "& .MuiInputLabel-root": {
    color: "text.secondary",
  },
};

function LanguageSwitcher({
  size = "small",
  minWidth = 140,
  colorVariant = "default",
}) {
  const { t } = useTranslation("common");
  const { language, setLanguage } = useLocale();
  const { notify } = useNotification();

  const labelId = "app-language-switcher-label";

  const handleChange = async (event) => {
    await setLanguage(event.target.value);

    notify({
      key: "languageChanged",
      severity: "success",
    });
  };

  return (
    <FormControl
      size={size}
      sx={
        colorVariant === "white"
          ? { minWidth, ...WHITE_VARIANT_SX }
          : { minWidth }
      }
    >
      <InputLabel id={labelId}>
        <TranslateIcon
          sx={{ fontSize: 18, verticalAlign: "middle", mr: 0.5 }}
        />
        {t("language.label")}
      </InputLabel>
      <Select
        labelId={labelId}
        value={language}
        label={t("language.label")}
        onChange={handleChange}
      >
        <MenuItem value="en">{t("language.english")}</MenuItem>
        <MenuItem value="ua">{t("language.ukrainian")}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default LanguageSwitcher;
