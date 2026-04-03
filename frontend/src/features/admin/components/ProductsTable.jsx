import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getLocalizedApiErrorMessage } from "../../../shared/lib/errors/getLocalizedApiErrorMessage";
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../../shared/ui/states/SectionLoadingState";
import AdminSearchField from "./AdminSearchField";

function ProductsTable({
  products,
  search,
  onSearchChange,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  isMutating,
}) {
  const { t } = useTranslation(["admin", "common"]);

  if (error) {
    return (
      <SectionErrorState
        message={getLocalizedApiErrorMessage(error, t)}
        onRetry={onRetry}
        retryLabel={t("common:actions.retry")}
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      <AdminSearchField
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        label={t("products.search")}
      />

      {isLoading ? (
        <SectionLoadingState label={t("common:states.loading")} />
      ) : !products.length ? (
        <EmptyStateCard
          title={t("products.emptyTitle")}
          description={t("products.emptyDescription")}
        />
      ) : (
        <Paper sx={{ p: 2, overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("products.columns.name")}</TableCell>
                <TableCell>{t("products.columns.calories")}</TableCell>
                <TableCell>{t("products.columns.proteins")}</TableCell>
                <TableCell>{t("products.columns.fats")}</TableCell>
                <TableCell>{t("products.columns.carbs")}</TableCell>
                <TableCell align="right">
                  {t("products.columns.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.calories}</TableCell>
                  <TableCell>{product.proteins}</TableCell>
                  <TableCell>{product.fats}</TableCell>
                  <TableCell>{product.carbs}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        size="small"
                        onClick={() => onEdit(product)}
                        disabled={isMutating}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(product)}
                        disabled={isMutating}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}

export default ProductsTable;
