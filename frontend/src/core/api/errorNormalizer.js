function statusToCode(status) {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status >= 500) return "SERVER_ERROR";
  return "REQUEST_FAILED";
}

function statusToDefaultMessage(status) {
  if (status === 400) return "Request data is invalid";
  if (status === 401) return "Please sign in again";
  if (status === 403) return "You do not have permission for this action";
  if (status === 404) return "Requested resource was not found";
  if (status === 409) return "Resource conflict";
  if (status >= 500) return "Server is unavailable";
  return "Request failed";
}

function extractMessage(payload, fallbackMessage) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  return fallbackMessage;
}

export class ApiClientError extends Error {
  constructor({
    message,
    status = 0,
    code = "UNKNOWN_ERROR",
    details = null,
    method = null,
    url = null,
    retryable = false,
    isNetworkError = false,
    isAuthError = false,
    isForbidden = false,
    isServerError = false,
    isCanceled = false,
    raw = null,
  }) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.method = method;
    this.url = url;
    this.retryable = retryable;
    this.isNetworkError = isNetworkError;
    this.isAuthError = isAuthError;
    this.isForbidden = isForbidden;
    this.isServerError = isServerError;
    this.isCanceled = isCanceled;
    this.raw = raw;
  }
}

export function createHttpError({ status, payload, url, method }) {
  const message = extractMessage(payload, statusToDefaultMessage(status));
  const code =
    payload && typeof payload === "object" && payload.code
      ? payload.code
      : statusToCode(status);

  return new ApiClientError({
    message,
    status,
    code,
    details: payload,
    method,
    url,
    retryable: status >= 500 || status === 429,
    isAuthError: status === 401,
    isForbidden: status === 403,
    isServerError: status >= 500,
    raw: payload,
  });
}

export function normalizeApiError(error, fallbackMessage = "Request failed") {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error?.name === "AbortError") {
    return new ApiClientError({
      message: "Request was cancelled",
      code: "REQUEST_ABORTED",
      retryable: false,
      isCanceled: true,
      raw: error,
    });
  }

  if (error instanceof TypeError) {
    return new ApiClientError({
      message: "Network connection error",
      code: "NETWORK_ERROR",
      retryable: true,
      isNetworkError: true,
      raw: error,
    });
  }

  if (error && typeof error === "object") {
    const status = Number(error.status || 0);

    if (status > 0) {
      return new ApiClientError({
        message: error.message || statusToDefaultMessage(status),
        status,
        code: error.code || statusToCode(status),
        details: error.details || error.data || null,
        method: error.method || null,
        url: error.url || null,
        retryable: status >= 500 || status === 429,
        isAuthError: status === 401,
        isForbidden: status === 403,
        isServerError: status >= 500,
        raw: error,
      });
    }
  }

  return new ApiClientError({
    message: fallbackMessage,
    code: "UNKNOWN_ERROR",
    raw: error,
  });
}
