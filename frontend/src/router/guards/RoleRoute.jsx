import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../core/auth/useAuth";
import { AUTH_STATUS } from "../../core/auth/constants";
import FullScreenLoader from "../../shared/ui/FullScreenLoader";
import { PATHS } from "../paths";

function RoleRoute({ allowedRoles }) {
  const { t } = useTranslation("common");
  const { status, isAuthenticated, user } = useAuth();

  if (status === AUTH_STATUS.BOOTSTRAPPING) {
    return <FullScreenLoader label={t("states.workspaceLoading")} />;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} replace />;
  }

  if (!user?.role) {
    return (
      <Navigate to={PATHS.login} replace state={{ reason: "missing-role" }} />
    );
  }

  if (user?.isActive === false) {
    return <Navigate to={PATHS.blocked} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.forbidden} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
