import TranslateIcon from "@mui/icons-material/Translate";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../core/i18n/useLocale";
import { useNotification } from "./notifications/useNotification";

function LanguageSwitcher({ size = "small", minWidth = 140 }) {
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
    <FormControl size={size} sx={{ minWidth }}>
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
