import {
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
import StatisticsCards from "../../features/admin/components/StatisticsCards";
import { useAdminSystemStatistics } from "../../features/admin/hooks/useAdminSystemStatistics";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function SystemStatisticsPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { stats, isLoading, error, retry } = useAdminSystemStatistics();

  if (error) {
    return (
      <SectionErrorState
        message={error.message}
        onRetry={retry}
        retryLabel={t("common:actions.retry")}
      />
    );
  }

  if (isLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  return (
    <Stack spacing={2.5}>
      <PageHeaderCard
        title={t("statistics.title")}
        description={t("statistics.description")}
      />

      <StatisticsCards stats={stats} />

      <Paper sx={{ p: 2, overflowX: "auto" }}>
        <Stack spacing={1}>
          <Typography variant="h6">{t("statistics.mostUsedTitle")}</Typography>

          {!stats.mostUsedProducts.length ? (
            <EmptyStateCard title={t("statistics.emptyProducts")} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("statistics.columns.product")}</TableCell>
                  <TableCell>{t("statistics.columns.usage")}</TableCell>
                  <TableCell>{t("statistics.columns.calories")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.mostUsedProducts.map((item) => (
                  <TableRow
                    key={`${item.product?.id || "unknown"}-${item.usage}`}
                  >
                    <TableCell>
                      {item.product?.name || t("statistics.unknownProduct")}
                    </TableCell>
                    <TableCell>{item.usage}</TableCell>
                    <TableCell>{item.product?.calories || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default SystemStatisticsPage;
