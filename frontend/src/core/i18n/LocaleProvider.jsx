import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { buildAppTheme } from "../../app/theme";
import { useAuth } from "../auth/useAuth";
import {
  getDirection,
  getLocaleTag,
  getLanguageLabel,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  writeStoredLanguage,
} from "./languages";
import { LocaleContext } from "./LocaleContextValue";
import i18n from "./i18n";

function createEmotionCache(direction) {
  return createCache({
    key: direction === "rtl" ? "muirtl" : "mui",
    stylisPlugins: direction === "rtl" ? [prefixer, rtlPlugin] : [prefixer],
  });
}

function LocaleProvider({ children }) {
  const { isAuthenticated, user, authFetch, updateUser } = useAuth();

  const [language, setLanguageState] = useState(
    normalizeLanguage(i18n.resolvedLanguage || i18n.language),
  );

  const direction = useMemo(() => getDirection(language), [language]);
  const localeTag = useMemo(() => getLocaleTag(language), [language]);

  const cache = useMemo(() => createEmotionCache(direction), [direction]);
  const theme = useMemo(
    () => buildAppTheme({ language, direction }),
    [direction, language],
  );

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage) => {
      setLanguageState(normalizeLanguage(nextLanguage));
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeTag;
    document.documentElement.dir = direction;
  }, [direction, localeTag]);

  useEffect(() => {
    const preferredLanguage = normalizeLanguage(user?.language);

    if (!isAuthenticated || !preferredLanguage) {
      return;
    }

    if (preferredLanguage !== language) {
      i18n.changeLanguage(preferredLanguage);
      writeStoredLanguage(preferredLanguage);
    }
  }, [isAuthenticated, language, user?.language]);

  const setLanguage = useCallback(
    async (nextLanguage, { persistToProfile = true } = {}) => {
      const normalized = normalizeLanguage(nextLanguage);

      if (normalized === language) {
        return;
      }

      await i18n.changeLanguage(normalized);
      writeStoredLanguage(normalized);

      if (!persistToProfile || !isAuthenticated) {
        return;
      }

      if (normalizeLanguage(user?.language) === normalized) {
        return;
      }

      try {
        const updatedUser = await authFetch("/users/me", {
          method: "PATCH",
          body: { language: normalized },
        });

        updateUser(updatedUser || { language: normalized });
      } catch {
        updateUser({ language: normalized });
      }
    },
    [authFetch, isAuthenticated, language, updateUser, user?.language],
  );

  const value = useMemo(
    () => ({
      language,
      localeTag,
      direction,
      supportedLanguages: SUPPORTED_LANGUAGES,
      getLanguageLabel,
      setLanguage,
    }),
    [direction, language, localeTag, setLanguage],
  );

  return (
    <LocaleContext.Provider value={value}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </LocaleContext.Provider>
  );
}

export default LocaleProvider;
