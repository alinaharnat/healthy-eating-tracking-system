import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../core/auth/useAuth";
import { AUTH_STATUS, ROLES } from "../core/auth/constants";
import { getDefaultRouteForRole } from "../core/auth/redirects";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import BackupAndImportExportPage from "../pages/admin/BackupAndImportExportPage";
import ProductsManagementPage from "../pages/admin/ProductsManagementPage";
import SystemStatisticsPage from "../pages/admin/SystemStatisticsPage";
import UserActivityPage from "../pages/admin/UserActivityPage";
import UsersManagementPage from "../pages/admin/UsersManagementPage";
import ActivityPage from "../pages/client/ActivityPage";
import ClientDashboardPage from "../pages/client/ClientDashboardPage";
import MealHistoryPage from "../pages/client/MealHistoryPage";
import MealsPage from "../pages/client/MealsPage";
import ProfilePage from "../pages/client/ProfilePage";
import RecommendationsPage from "../pages/client/RecommendationsPage";
import ReportsPage from "../pages/client/ReportsPage";
import CreateRecommendationPage from "../pages/dietitian/CreateRecommendationPage";
import DietitianDashboardPage from "../pages/dietitian/DietitianDashboardPage";
import PatientDetailsPage from "../pages/dietitian/PatientDetailsPage";
import PatientsPage from "../pages/dietitian/PatientsPage";
import RecommendationsManagementPage from "../pages/dietitian/RecommendationsManagementPage";
import BlockedPage from "../pages/public/BlockedPage";
import ForbiddenPage from "../pages/public/ForbiddenPage";
import LoginPage from "../pages/public/LoginPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import RegisterPage from "../pages/public/RegisterPage";
import FullScreenLoader from "../shared/ui/FullScreenLoader";
import GuestOnlyRoute from "./guards/GuestOnlyRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import ClientLayout from "./layouts/ClientLayout";
import DietitianLayout from "./layouts/DietitianLayout";
import { PATHS } from "./paths";

function RootRedirect() {
  const { t } = useTranslation("common");
  const { status, isAuthenticated, user } = useAuth();

  if (status === AUTH_STATUS.BOOTSTRAPPING) {
    return <FullScreenLoader label={t("states.appPreparing")} />;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} replace />;
  }

  return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.root} element={<RootRedirect />} />

        <Route element={<GuestOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={PATHS.login} element={<LoginPage />} />
            <Route path={PATHS.register} element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.CLIENT]} />}>
            <Route path={PATHS.client.root} element={<ClientLayout />}>
              <Route index element={<ClientDashboardPage />} />
              <Route path="meals" element={<MealsPage />} />
              <Route path="meals/history" element={<MealHistoryPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="recommendations" element={<RecommendationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.DIETITIAN]} />}>
            <Route path={PATHS.dietitian.root} element={<DietitianLayout />}>
              <Route index element={<DietitianDashboardPage />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route
                path="patients/:patientId"
                element={<PatientDetailsPage />}
              />
              <Route
                path="recommendations"
                element={<RecommendationsManagementPage />}
              />
              <Route
                path="recommendations/new"
                element={<CreateRecommendationPage />}
              />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path={PATHS.admin.root} element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<UsersManagementPage />} />
              <Route
                path="users/:userId/activity"
                element={<UserActivityPage />}
              />
              <Route path="products" element={<ProductsManagementPage />} />
              <Route path="statistics" element={<SystemStatisticsPage />} />
              <Route path="backup" element={<BackupAndImportExportPage />} />
            </Route>
          </Route>
        </Route>

        <Route path={PATHS.forbidden} element={<ForbiddenPage />} />
        <Route path={PATHS.blocked} element={<BlockedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
