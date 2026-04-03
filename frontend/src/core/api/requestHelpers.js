import { normalizeApiError } from "./errorNormalizer";

export function createRequestController() {
  const controller = new AbortController();

  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
}

export function isAbortError(error) {
  const normalized = normalizeApiError(error);
  return normalized.isCanceled;
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function withRetry(requestFn, options = {}) {
  const {
    retries = 0,
    delayMs = 300,
    backoffFactor = 2,
    shouldRetry = (error) => normalizeApiError(error).retryable,
  } = options;

  let attempt = 0;
  let currentDelay = delayMs;

  while (true) {
    try {
      return await requestFn();
    } catch (error) {
      const normalized = normalizeApiError(error);

      if (attempt >= retries || !shouldRetry(normalized)) {
        throw normalized;
      }

      attempt += 1;
      await sleep(currentDelay);
      currentDelay *= backoffFactor;
    }
  }
}
