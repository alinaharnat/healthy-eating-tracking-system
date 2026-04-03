import { useCallback, useEffect, useMemo, useReducer } from "react";
import { AUTH_STATUS } from "./constants";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "./authStorage";
import {
  ApiError,
  apiRequest,
  fetchCurrentUser,
  loginRequest,
  registerRequest,
} from "./authApi";
import { AuthContext } from "./AuthContextValue";
import { setApiUnauthorizedHandler } from "../api";

const initialToken = getStoredToken();

const INITIAL_STATE = {
  status: initialToken
    ? AUTH_STATUS.BOOTSTRAPPING
    : AUTH_STATUS.UNAUTHENTICATED,
  token: initialToken,
  user: null,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_BOOTSTRAPPING":
      return {
        ...state,
        status: AUTH_STATUS.BOOTSTRAPPING,
        token: action.payload?.token ?? state.token,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        status: AUTH_STATUS.AUTHENTICATED,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };

    case "AUTH_LOGOUT":
      return {
        status: AUTH_STATUS.UNAUTHENTICATED,
        token: null,
        user: null,
        error: action.payload?.error || null,
      };

    case "AUTH_USER_UPDATED":
      return {
        ...state,
        user: state.user
          ? { ...state.user, ...action.payload.user }
          : action.payload.user,
      };

    default:
      return state;
  }
}

function validateActiveUser(user) {
  if (!user) {
    return "Unable to load current user";
  }

  if (!user.role) {
    return "Role is missing in user profile";
  }

  return null;
}

function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed";
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  const logout = useCallback(({ reason } = {}) => {
    clearStoredToken();
    dispatch({
      type: "AUTH_LOGOUT",
      payload: {
        error: reason || null,
      },
    });
  }, []);

  const updateUser = useCallback((nextUserData) => {
    if (!nextUserData) {
      return;
    }

    dispatch({
      type: "AUTH_USER_UPDATED",
      payload: {
        user: nextUserData,
      },
    });
  }, []);

  const bootstrapAuth = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      dispatch({ type: "AUTH_LOGOUT" });
      return;
    }

    dispatch({ type: "AUTH_BOOTSTRAPPING", payload: { token } });

    try {
      const user = await fetchCurrentUser(token);
      const validationError = validateActiveUser(user);

      if (validationError) {
        logout({ reason: validationError });
        return;
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          token,
          user,
        },
      });
    } catch (error) {
      logout({ reason: getErrorMessage(error) });
    }
  }, [logout]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    return setApiUnauthorizedHandler((error) => {
      logout({ reason: error?.message || "Session expired" });
    });
  }, [logout]);

  const login = useCallback(
    async ({ email, password }) => {
      dispatch({ type: "AUTH_BOOTSTRAPPING", payload: { token: null } });

      const authPayload = await loginRequest({ email, password });
      const token = authPayload?.token;

      if (!token) {
        throw new Error("Token is missing in login response");
      }

      setStoredToken(token);

      try {
        const user = await fetchCurrentUser(token);
        const validationError = validateActiveUser(user);

        if (validationError) {
          throw new Error(validationError);
        }

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            token,
            user,
          },
        });

        return user;
      } catch (error) {
        logout({ reason: getErrorMessage(error) });
        throw error;
      }
    },
    [logout],
  );

  const register = useCallback(
    async ({ email, password }) => {
      const generatedName = email.split("@")[0] || "user";

      dispatch({ type: "AUTH_BOOTSTRAPPING", payload: { token: null } });

      const authPayload = await registerRequest({
        name: generatedName,
        email,
        password,
      });

      const token = authPayload?.token;

      if (!token) {
        throw new Error("Token is missing in register response");
      }

      setStoredToken(token);

      try {
        const user = await fetchCurrentUser(token);
        const validationError = validateActiveUser(user);

        if (validationError) {
          throw new Error(validationError);
        }

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            token,
            user,
          },
        });

        return user;
      } catch (error) {
        logout({ reason: getErrorMessage(error) });
        throw error;
      }
    },
    [logout],
  );

  const authFetch = useCallback(
    async (path, options = {}) => {
      const token = state.token || getStoredToken();
      try {
        const result = await apiRequest(path, { ...options, token });
        return result;
      } catch (error) {
        if (error?.status === 401 || error?.status === 403) {
          logout({ reason: "Session expired" });
        }

        throw error;
      }
    },
    [logout, state.token],
  );

  const handleAuthError = useCallback(
    (error) => {
      if (error?.status === 401 || error?.status === 403) {
        logout({ reason: "Session expired" });
      }
    },
    [logout],
  );

  const isAuthenticated =
    state.status === AUTH_STATUS.AUTHENTICATED &&
    Boolean(state.token) &&
    Boolean(state.user);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated,
      login,
      register,
      logout,
      bootstrapAuth,
      authFetch,
      handleAuthError,
      updateUser,
    }),
    [
      state,
      isAuthenticated,
      login,
      register,
      logout,
      bootstrapAuth,
      authFetch,
      handleAuthError,
      updateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
