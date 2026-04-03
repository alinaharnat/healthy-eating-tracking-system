import { getLocaleTag, normalizeLanguage } from "../../../core/i18n/languages";

export function formatLocalizedDateTime(
  value,
  { language = "en", dateStyle = "medium", timeStyle = "short" } = {},
) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  const localeTag = getLocaleTag(normalizeLanguage(language));

  return new Intl.DateTimeFormat(localeTag, {
    dateStyle,
    timeStyle,
  }).format(date);
}

export function formatLocalizedDate(
  value,
  { language = "en", dateStyle = "medium" } = {},
) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  const localeTag = getLocaleTag(normalizeLanguage(language));

  return new Intl.DateTimeFormat(localeTag, {
    dateStyle,
  }).format(date);
}
