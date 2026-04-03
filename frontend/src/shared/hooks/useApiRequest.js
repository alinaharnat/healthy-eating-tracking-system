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

  useEffect(() => {
    requestFnRef.current = requestFn;
  }, [requestFn]);

  useEffect(() => {
    if (immediateParams) {
      lastParamsRef.current = immediateParams;
    }
  }, [immediateParams]);

  const cancel = useCallback(() => {
    requestControllerRef.current?.cancel();
    requestControllerRef.current = null;
  }, []);

  const run = useCallback(
    async (params = {}) => {
      cancel();

      const requestController = createRequestController();
      requestControllerRef.current = requestController;
      lastParamsRef.current = params;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

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

        setState({
          data,
          error: null,
          isLoading: false,
        });

        return data;
      } catch (error) {
        const normalizedError = normalizeApiError(error);

        if (!normalizedError.isCanceled) {
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

      cancel();
    };
  }, [cancel, manual, run]);

  return {
    ...state,
    run,
    retry,
    cancel,
  };
}
