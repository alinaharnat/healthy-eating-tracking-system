import DashboardIcon from "@mui/icons-material/Dashboard";
import DiningIcon from "@mui/icons-material/Dining";
import HistoryIcon from "@mui/icons-material/History";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import PrivateLayoutFrame from "./PrivateLayoutFrame";
import { PATHS } from "../paths";

function ClientLayout() {
  const { t } = useTranslation("common");

  const clientMenu = [
    {
      label: t("navigation.dashboard"),
      to: PATHS.client.root,
      icon: <DashboardIcon />,
    },
    {
      label: t("navigation.meals"),
      to: PATHS.client.meals,
      icon: <DiningIcon />,
    },
    {
      label: t("navigation.history"),
      to: PATHS.client.mealHistory,
      icon: <HistoryIcon />,
    },
    {
      label: t("navigation.activity"),
      to: PATHS.client.activity,
      icon: <MonitorHeartIcon />,
    },
    {
      label: t("navigation.recommendations"),
      to: PATHS.client.recommendations,
      icon: <TipsAndUpdatesIcon />,
    },
    {
      label: t("navigation.reports"),
      to: PATHS.client.reports,
      icon: <DescriptionIcon />,
    },
    {
      label: t("navigation.profile"),
      to: PATHS.client.profile,
      icon: <PersonIcon />,
    },
  ];

  return (
    <PrivateLayoutFrame
      title={t("workspace.client")}
      menuItems={clientMenu}
      appBarColor="primary"
    />
  );
}

export default ClientLayout;
