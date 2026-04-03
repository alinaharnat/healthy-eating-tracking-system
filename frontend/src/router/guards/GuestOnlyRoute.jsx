import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../core/auth/useAuth";
import { AUTH_STATUS } from "../../core/auth/constants";
import { getDefaultRouteForRole } from "../../core/auth/redirects";
import FullScreenLoader from "../../shared/ui/FullScreenLoader";

function GuestOnlyRoute() {
  const { t } = useTranslation("common");
  const { status, isAuthenticated, user } = useAuth();

  if (status === AUTH_STATUS.BOOTSTRAPPING) {
    return <FullScreenLoader label={t("states.sessionCheck")} />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
}

export default GuestOnlyRoute;
