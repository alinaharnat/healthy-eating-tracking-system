export const SUPPORTED_LANGUAGES = ["en", "ua"];

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_STORAGE_KEY = "macro_language";

const LANGUAGE_META = {
  en: {
    localeTag: "en-US",
    direction: "ltr",
    label: "English",
  },
  ua: {
    localeTag: "uk-UA",
    direction: "ltr",
    label: "Українська",
  },
};

export function normalizeLanguage(language) {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = String(language).toLowerCase().trim();

  if (SUPPORTED_LANGUAGES.includes(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("uk")) {
    return "ua";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  return DEFAULT_LANGUAGE;
}

export function readStoredLanguage() {
  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

export function writeStoredLanguage(language) {
  const normalized = normalizeLanguage(language);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
}

export function getBrowserLanguage() {
  const browserLanguage =
    window.navigator.languages?.[0] || window.navigator.language || "";

  return normalizeLanguage(browserLanguage);
}

export function resolveInitialLanguage() {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (stored) {
    return normalizeLanguage(stored);
  }

  return getBrowserLanguage();
}

export function getDirection(language) {
  return LANGUAGE_META[normalizeLanguage(language)]?.direction || "ltr";
}

export function getLocaleTag(language) {
  return LANGUAGE_META[normalizeLanguage(language)]?.localeTag || "en-US";
}

export function getLanguageLabel(language) {
  return LANGUAGE_META[normalizeLanguage(language)]?.label || "English";
}
