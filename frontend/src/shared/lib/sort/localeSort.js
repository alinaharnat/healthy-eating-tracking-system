import { getLocaleTag, normalizeLanguage } from "../../../core/i18n/languages";

export function sortByLocale(items, selector, language, options = {}) {
  const localeTag = getLocaleTag(normalizeLanguage(language));
  const collator = new Intl.Collator(localeTag, {
    sensitivity: "base",
    numeric: true,
    ...options,
  });

  return [...items].sort((left, right) => {
    const leftValue = selector(left) ?? "";
    const rightValue = selector(right) ?? "";

    return collator.compare(String(leftValue), String(rightValue));
  });
}
