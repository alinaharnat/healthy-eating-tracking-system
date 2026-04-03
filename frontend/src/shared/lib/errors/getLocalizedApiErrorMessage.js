const CODE_TO_KEY = {
  BAD_REQUEST: "notifications:errors.badRequest",
  UNAUTHORIZED: "notifications:errors.unauthorized",
  FORBIDDEN: "notifications:errors.forbidden",
  NOT_FOUND: "notifications:errors.notFound",
  CONFLICT: "notifications:errors.conflict",
  SERVER_ERROR: "notifications:errors.server",
  NETWORK_ERROR: "notifications:errors.network",
  REQUEST_ABORTED: "notifications:errors.cancelled",
  REQUEST_FAILED: "notifications:errors.requestFailed",
};

function statusToFallbackCode(status) {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status >= 500) return "SERVER_ERROR";
  return "REQUEST_FAILED";
}

export function getLocalizedApiErrorMessage(
  error,
  t,
  { fallbackKey = "notifications:unknownError" } = {},
) {
  if (!error) {
    return t(fallbackKey);
  }

  const code = error.code || statusToFallbackCode(Number(error.status || 0));
  const mappedKey = CODE_TO_KEY[code];

  if (mappedKey) {
    return t(mappedKey);
  }

  return t(fallbackKey);
}
