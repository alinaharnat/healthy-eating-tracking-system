import { Paper, Stack, Typography } from "@mui/material";

function PageHeaderCard({ title, description, actions = null }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5">{title}</Typography>
          {description ? (
            <Typography color="text.secondary">{description}</Typography>
          ) : null}
        </Stack>
        {actions}
      </Stack>
    </Paper>
  );
}

export default PageHeaderCard;
