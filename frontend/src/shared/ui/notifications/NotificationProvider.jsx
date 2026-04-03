import { Alert, Snackbar } from "@mui/material";
import { useMemo, useState } from "react";
import i18n from "../../../core/i18n/i18n";
import { NotificationContext } from "./NotificationContextValue";

const initialState = {
  open: false,
  severity: "info",
  messageKey: "",
  values: undefined,
  namespace: "notifications",
};

function NotificationProvider({ children }) {
  const [state, setState] = useState(initialState);

  const close = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  const notify = ({
    key,
    severity = "info",
    values,
    namespace = "notifications",
  }) => {
    setState({
      open: true,
      severity,
      messageKey: key,
      values,
      namespace,
    });
  };

  const contextValue = useMemo(
    () => ({
      notify,
      close,
    }),
    [],
  );

  const message = state.messageKey
    ? i18n.t(state.messageKey, {
        ns: state.namespace,
        ...state.values,
      })
    : "";

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={2800}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={close} severity={state.severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
