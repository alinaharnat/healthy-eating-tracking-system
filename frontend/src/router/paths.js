export const PATHS = {
  root: "/",
  login: "/login",
  register: "/register",
  forbidden: "/forbidden",
  blocked: "/blocked",

  client: {
    root: "/client",
    meals: "/client/meals",
    mealHistory: "/client/meals/history",
    activity: "/client/activity",
    recommendations: "/client/recommendations",
    reports: "/client/reports",
    products: "/client/products",
    profile: "/client/profile",
    dietitianConnection: "/client/dietitian-connection",
  },

  dietitian: {
    root: "/dietitian",
    patients: "/dietitian/patients",
    patientDetails: (patientId = ":patientId") =>
      `/dietitian/patients/${patientId}`,
    recommendationsManagement: "/dietitian/recommendations",
    recommendationsCreate: "/dietitian/recommendations/new",
    recommendations: "/dietitian/recommendations",
    assignmentRequests: "/dietitian/assignment-requests",
  },

  admin: {
    root: "/admin",
    users: "/admin/users",
    userActivity: (userId = ":userId") => `/admin/users/${userId}/activity`,
    products: "/admin/products",
    statistics: "/admin/statistics",
    backup: "/admin/backup",
  },
};
