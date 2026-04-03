import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import PostAddIcon from "@mui/icons-material/PostAdd";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useTranslation } from "react-i18next";
import PrivateLayoutFrame from "./PrivateLayoutFrame";
import { PATHS } from "../paths";

function DietitianLayout() {
  const { t } = useTranslation(["common", "dietitian"]);

  const dietitianMenu = [
    {
      label: t("dietitian:navigation.dashboard"),
      to: PATHS.dietitian.root,
      icon: <DashboardIcon />,
    },
    {
      label: t("dietitian:navigation.patients"),
      to: PATHS.dietitian.patients,
      icon: <GroupsIcon />,
    },
    {
      label: t("dietitian:navigation.recommendations"),
      to: PATHS.dietitian.recommendationsManagement,
      icon: <TipsAndUpdatesIcon />,
    },
    {
      label: t("dietitian:navigation.createRecommendation"),
      to: PATHS.dietitian.recommendationsCreate,
      icon: <PostAddIcon />,
    },
  ];

  return (
    <PrivateLayoutFrame
      title={t("workspace.dietitian")}
      menuItems={dietitianMenu}
      appBarColor="secondary"
    />
  );
}

export default DietitianLayout;
