import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeApiError } from "../../core/api/errorNormalizer";
import {
  createRequestController,
  withRetry,
} from "../../core/api/requestHelpers";

const INITIAL_STATE = {
  data: null,
  error: null,
  isLoading: false,
};

function stableSerialize(value) {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  const keys = Object.keys(value).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
    .join(",")}}`;
}

export function useApiRequest(requestFn, options = {}) {
  const {
    manual = true,
    retries = 0,
    retryDelayMs = 250,
    immediateParams,
  } = options;

  const [state, setState] = useState(INITIAL_STATE);
  const requestControllerRef = useRef(null);
  const requestFnRef = useRef(requestFn);
  const lastParamsRef = useRef(immediateParams || {});
  const isMountedRef = useRef(true);
  const runIdRef = useRef(0);
  const immediateParamsKey = stableSerialize(immediateParams || {});

  useEffect(() => {
    requestFnRef.current = requestFn;
  }, [requestFn]);

  useEffect(() => {
    if (immediateParams !== undefined) {
      lastParamsRef.current = immediateParams;
    }
  }, [immediateParams, immediateParamsKey]);

  const cancel = useCallback(() => {
    requestControllerRef.current?.cancel();
    requestControllerRef.current = null;
  }, []);

  const run = useCallback(
    async (params = {}) => {
      cancel();

      const runId = runIdRef.current + 1;
      runIdRef.current = runId;

      const requestController = createRequestController();
      requestControllerRef.current = requestController;
      lastParamsRef.current = params;

      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));
      }

      try {
        const data = await withRetry(
          () =>
            requestFnRef.current({
              ...params,
              signal: requestController.signal,
            }),
          {
            retries,
            delayMs: retryDelayMs,
          },
        );

        if (isMountedRef.current && runId === runIdRef.current) {
          setState({
            data,
            error: null,
            isLoading: false,
          });
        }

        return data;
      } catch (error) {
        const normalizedError = normalizeApiError(error);

        if (
          isMountedRef.current &&
          runId === runIdRef.current &&
          !normalizedError.isCanceled
        ) {
          setState((prev) => ({
            ...prev,
            error: normalizedError,
            isLoading: false,
          }));
        }

        throw normalizedError;
      }
    },
    [cancel, retries, retryDelayMs],
  );

  const retry = useCallback(() => run(lastParamsRef.current || {}), [run]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      cancel();
    };
  }, [cancel]);

  useEffect(() => {
    let timeoutId = null;

    if (!manual) {
      timeoutId = window.setTimeout(() => {
        run(lastParamsRef.current || {}).catch(() => null);
      }, 0);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (!manual) {
        cancel();
      }
    };
  }, [cancel, manual, run, immediateParamsKey]);

  return {
    ...state,
    run,
    retry,
    cancel,
  };
}
