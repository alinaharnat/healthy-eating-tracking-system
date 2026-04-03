import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BackupIcon from "@mui/icons-material/Backup";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";
import LanguageSwitcher from "../../shared/ui/LanguageSwitcher";
import { PATHS } from "../paths";

const DRAWER_WIDTH = 280;

function AdminLayout() {
  const { t } = useTranslation(["common", "admin"]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: t("admin:navigation.overview"),
      to: PATHS.admin.root,
      icon: <AdminPanelSettingsIcon />,
    },
    {
      label: t("admin:navigation.users"),
      to: PATHS.admin.users,
      icon: <PeopleIcon />,
    },
    {
      label: t("admin:navigation.products"),
      to: PATHS.admin.products,
      icon: <Inventory2Icon />,
    },
    {
      label: t("admin:navigation.statistics"),
      to: PATHS.admin.statistics,
      icon: <BarChartIcon />,
    },
    {
      label: t("admin:navigation.backup"),
      to: PATHS.admin.backup,
      icon: <BackupIcon />,
    },
  ];

  const handleLogout = () => {
    logout({ reason: "Admin logged out" });
    navigate(PATHS.login, { replace: true });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0f172a" }}>
      <AppBar
        position="fixed"
        sx={{
          ml: `${DRAWER_WIDTH}px`,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          bgcolor: "#111827",
          borderBottom: "1px solid #1f2937",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("admin:title")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user?.email || ""}
            </Typography>
          </Box>
          <LanguageSwitcher minWidth={132} />
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            {t("common:actions.logout")}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#020617",
            color: "#dbeafe",
            borderRight: "1px solid #1f2937",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("admin:sidebarTitle")}
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                sx={{
                  "&.active": {
                    bgcolor: "rgba(59,130,246,0.22)",
                    borderLeft: "3px solid #60a5fa",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#93c5fd" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          color: "#e2e8f0",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
