import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../core/auth/useAuth";
import { AUTH_STATUS } from "../../core/auth/constants";
import FullScreenLoader from "../../shared/ui/FullScreenLoader";
import { PATHS } from "../paths";

function ProtectedRoute() {
  const { t } = useTranslation("common");
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.BOOTSTRAPPING) {
    return <FullScreenLoader label={t("states.sessionCheck")} />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATHS.login}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
