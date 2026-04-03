import { getLocaleTag, normalizeLanguage } from "../../../core/i18n/languages";

export function formatLocalizedNumber(value, { language = "en" } = {}) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "";
  }

  const localeTag = getLocaleTag(normalizeLanguage(language));

  return new Intl.NumberFormat(localeTag).format(Number(value));
}
