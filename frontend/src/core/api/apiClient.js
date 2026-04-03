import { buildQueryString } from "./queryString";
import { createHttpError, normalizeApiError } from "./errorNormalizer";

function isJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null;
  }

  if (isJsonResponse(response)) {
    return response.json();
  }

  return response.text();
}

function unwrapPayload(payload) {
  if (
    payload &&
    typeof payload === "object" &&
    payload.success === true &&
    Object.prototype.hasOwnProperty.call(payload, "data")
  ) {
    return payload.data;
  }

  return payload;
}

function joinUrl(baseUrl, path) {
  const normalizedBase = String(baseUrl || "").replace(/\/+$/, "");
  const normalizedPath = String(path || "").replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export function createApiClient({ baseUrl, getAuthToken }) {
  let unauthorizedHandler = null;

  const setUnauthorizedHandler = (handler) => {
    unauthorizedHandler = typeof handler === "function" ? handler : null;

    return () => {
      if (unauthorizedHandler === handler) {
        unauthorizedHandler = null;
      }
    };
  };

  const request = async (path, options = {}) => {
    const {
      method = "GET",
      query,
      body,
      headers = {},
      signal,
      auth = true,
      token,
    } = options;

    const url = `${joinUrl(baseUrl, path)}${buildQueryString(query)}`;

    const requestHeaders = {
      Accept: "application/json",
      ...headers,
    };

    if (!(body instanceof FormData)) {
      requestHeaders["Content-Type"] =
        requestHeaders["Content-Type"] || "application/json";
    }

    const resolvedToken = token || (auth ? getAuthToken?.() : null);

    if (auth && resolvedToken) {
      requestHeaders.Authorization = `Bearer ${resolvedToken}`;
    }

    const config = {
      method,
      headers: requestHeaders,
      signal,
    };

    if (body !== undefined) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const payload = await parseResponseBody(response);

      if (!response.ok) {
        const error = createHttpError({
          status: response.status,
          payload,
          method,
          url,
        });

        if (
          (error.isAuthError || error.isForbidden) &&
          unauthorizedHandler &&
          auth
        ) {
          unauthorizedHandler(error);
        }

        throw error;
      }

      return unwrapPayload(payload);
    } catch (error) {
      throw normalizeApiError(error);
    }
  };

  return {
    request,
    setUnauthorizedHandler,
    get: (path, options = {}) => request(path, { ...options, method: "GET" }),
    post: (path, body, options = {}) =>
      request(path, { ...options, method: "POST", body }),
    put: (path, body, options = {}) =>
      request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options = {}) =>
      request(path, { ...options, method: "PATCH", body }),
    delete: (path, options = {}) =>
      request(path, { ...options, method: "DELETE" }),
  };
}
