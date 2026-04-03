import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  resolveInitialLanguage,
  SUPPORTED_LANGUAGES,
} from "./languages";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enAdmin from "./locales/en/admin.json";
import enValidation from "./locales/en/validation.json";
import enNotifications from "./locales/en/notifications.json";
import enMeals from "./locales/en/meals.json";
import enProducts from "./locales/en/products.json";
import enRecommendations from "./locales/en/recommendations.json";
import enReports from "./locales/en/reports.json";
import enAnalytics from "./locales/en/analytics.json";
import enProfile from "./locales/en/profile.json";
import enDietitian from "./locales/en/dietitian.json";

import uaCommon from "./locales/ua/common.json";
import uaAuth from "./locales/ua/auth.json";
import uaDashboard from "./locales/ua/dashboard.json";
import uaAdmin from "./locales/ua/admin.json";
import uaValidation from "./locales/ua/validation.json";
import uaNotifications from "./locales/ua/notifications.json";
import uaMeals from "./locales/ua/meals.json";
import uaProducts from "./locales/ua/products.json";
import uaRecommendations from "./locales/ua/recommendations.json";
import uaReports from "./locales/ua/reports.json";
import uaAnalytics from "./locales/ua/analytics.json";
import uaProfile from "./locales/ua/profile.json";
import uaDietitian from "./locales/ua/dietitian.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    admin: enAdmin,
    validation: enValidation,
    notifications: enNotifications,
    meals: enMeals,
    products: enProducts,
    recommendations: enRecommendations,
    reports: enReports,
    analytics: enAnalytics,
    profile: enProfile,
    dietitian: enDietitian,
  },
  ua: {
    common: uaCommon,
    auth: uaAuth,
    dashboard: uaDashboard,
    admin: uaAdmin,
    validation: uaValidation,
    notifications: uaNotifications,
    meals: uaMeals,
    products: uaProducts,
    recommendations: uaRecommendations,
    reports: uaReports,
    analytics: uaAnalytics,
    profile: uaProfile,
    dietitian: uaDietitian,
  },
};

const namespaces = [
  "common",
  "auth",
  "dashboard",
  "admin",
  "validation",
  "notifications",
  "meals",
  "products",
  "recommendations",
  "reports",
  "analytics",
  "profile",
  "dietitian",
];

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: resolveInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: namespaces,
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export default i18n;
