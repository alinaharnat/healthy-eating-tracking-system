import "../core/i18n/i18n";
import { AuthProvider } from "../core/auth/AuthContext";
import LocaleProvider from "../core/i18n/LocaleProvider";
import AppRouter from "../router";
import NotificationProvider from "../shared/ui/notifications/NotificationProvider";

function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}

export default App;
