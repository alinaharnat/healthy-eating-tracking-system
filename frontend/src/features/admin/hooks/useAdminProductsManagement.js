import { useCallback, useEffect, useMemo, useState } from "react";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { createProduct, searchProducts } from "../../products/api";
import { deleteProductAdmin, updateProductAdmin } from "../api";

export function useAdminProductsManagement() {
  const [search, setSearch] = useState("");
  const [successKey, setSuccessKey] = useState("");

  // Assumption: regular product search endpoint is available to admin role for listing.
  const productsRequest = useApiRequest(
    ({ query, signal }) => searchProducts({ search: query }, { signal }),
    {
      manual: true,
      retries: 1,
    },
  );

  const updateRequest = useApiRequest(
    ({ productId, payload, signal }) =>
      updateProductAdmin(productId, payload, { signal }),
    {
      manual: true,
    },
  );

  const createRequest = useApiRequest(
    ({ payload, signal }) => createProduct(payload, { signal }),
    {
      manual: true,
    },
  );

  const deleteRequest = useApiRequest(
    ({ productId, signal }) => deleteProductAdmin(productId, { signal }),
    {
      manual: true,
    },
  );

  const productsRun = productsRequest.run;
  const createRun = createRequest.run;
  const updateRun = updateRequest.run;
  const deleteRun = deleteRequest.run;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      productsRun({ query: search.trim() }).catch(() => null);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [productsRun, search]);

  const reload = useCallback(async () => {
    await productsRun({ query: search.trim() });
  }, [productsRun, search]);

  const addProduct = useCallback(
    async (payload) => {
      const result = await createRun({ payload });
      setSuccessKey("feedback.productCreated");
      await reload();
      return result;
    },
    [createRun, reload],
  );

  const updateProduct = useCallback(
    async ({ productId, payload }) => {
      const result = await updateRun({ productId, payload });
      setSuccessKey("feedback.productUpdated");
      await reload();
      return result;
    },
    [reload, updateRun],
  );

  const removeProduct = useCallback(
    async (productId) => {
      const result = await deleteRun({ productId });
      setSuccessKey("feedback.productDeleted");
      await reload();
      return result;
    },
    [deleteRun, reload],
  );

  const products = useMemo(
    () => productsRequest.data || [],
    [productsRequest.data],
  );

  return {
    search,
    setSearch,
    products,
    isLoading: productsRequest.isLoading,
    error: productsRequest.error,
    retry: productsRequest.retry,
    reload,
    addProduct,
    updateProduct,
    removeProduct,
    mutationError:
      createRequest.error || updateRequest.error || deleteRequest.error || null,
    isMutating:
      createRequest.isLoading ||
      updateRequest.isLoading ||
      deleteRequest.isLoading,
    successKey,
    clearSuccessKey: () => setSuccessKey(""),
  };
}
