import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../../features/admin/components/ConfirmationDialog";
import ProductEditDialog from "../../features/admin/components/ProductEditDialog";
import ProductsTable from "../../features/admin/components/ProductsTable";
import { useAdminProductsManagement } from "../../features/admin/hooks/useAdminProductsManagement";
import { getLocalizedApiErrorMessage } from "../../shared/lib/errors/getLocalizedApiErrorMessage";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";

function ProductsManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { notify } = useNotification();

  const {
    search,
    setSearch,
    products,
    isLoading,
    error,
    retry,
    addProduct,
    updateProduct,
    removeProduct,
    mutationError,
    isMutating,
    successKey,
    clearSuccessKey,
  } = useAdminProductsManagement();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    if (!successKey) {
      return;
    }

    notify({
      key: successKey,
      namespace: "admin",
      severity: "success",
    });

    clearSuccessKey();
  }, [clearSuccessKey, notify, successKey]);

  useEffect(() => {
    if (!mutationError) {
      return;
    }

    notify({
      message: getLocalizedApiErrorMessage(mutationError, t),
      severity: "error",
    });
  }, [mutationError, notify, t]);

  return (
    <Stack spacing={2.5}>
      <PageHeaderCard
        title={t("products.title")}
        description={t("products.description")}
        actions={
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setIsCreateOpen(true)}
            disabled={isMutating}
          >
            {t("products.actions.add")}
          </Button>
        }
      />

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

      {isCreateOpen ? (
        <ProductEditDialog
          open={isCreateOpen}
          mode="create"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={async (payload) => {
            await addProduct(payload);
            setIsCreateOpen(false);
          }}
          isSubmitting={isMutating}
          error={mutationError}
        />
      ) : null}

      {editingProduct ? (
        <ProductEditDialog
          key={editingProduct.id}
          open={Boolean(editingProduct)}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          mode="edit"
          onSubmit={async (payload) => {
            await updateProduct({ productId: editingProduct.id, payload });
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
