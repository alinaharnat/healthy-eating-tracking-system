import { Alert, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../../features/admin/components/ConfirmationDialog";
import ProductEditDialog from "../../features/admin/components/ProductEditDialog";
import ProductsTable from "../../features/admin/components/ProductsTable";
import { useAdminProductsManagement } from "../../features/admin/hooks/useAdminProductsManagement";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";

function ProductsManagementPage() {
  const { t } = useTranslation(["admin", "common"]);

  const {
    search,
    setSearch,
    products,
    isLoading,
    error,
    retry,
    updateProduct,
    removeProduct,
    mutationError,
    isMutating,
    successMessage,
    clearSuccessMessage,
  } = useAdminProductsManagement();

  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  return (
    <Stack spacing={2.5}>
      <PageHeaderCard
        title={t("products.title")}
        description={t("products.description")}
      />

      {successMessage ? (
        <Alert severity="success" onClose={clearSuccessMessage}>
          {successMessage}
        </Alert>
      ) : null}

      {mutationError ? (
        <Alert severity="error">{mutationError.message}</Alert>
      ) : null}

      <ProductsTable
        products={products}
        search={search}
        onSearchChange={setSearch}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        onEdit={setEditingProduct}
        onDelete={setDeletingProduct}
        isMutating={isMutating}
      />

      {editingProduct ? (
        <ProductEditDialog
          key={editingProduct.id}
          open={Boolean(editingProduct)}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={async ({ productId, payload }) => {
            await updateProduct({ productId, payload });
            setEditingProduct(null);
          }}
          isSubmitting={isMutating}
          error={mutationError}
        />
      ) : null}

      <ConfirmationDialog
        open={Boolean(deletingProduct)}
        title={t("products.dialogs.deleteTitle")}
        description={t("products.dialogs.deleteDescription", {
          name: deletingProduct?.name || "",
        })}
        confirmLabel={t("actions.delete")}
        cancelLabel={t("actions.cancel")}
        onConfirm={async () => {
          if (!deletingProduct?.id) {
            return;
          }

          await removeProduct(deletingProduct.id);
          setDeletingProduct(null);
        }}
        onClose={() => setDeletingProduct(null)}
        isSubmitting={isMutating}
      />
    </Stack>
  );
}

export default ProductsManagementPage;
