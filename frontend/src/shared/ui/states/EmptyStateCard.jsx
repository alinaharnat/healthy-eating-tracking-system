import { Button, Paper, Stack, Typography } from "@mui/material";

function EmptyStateCard({ title, description, actionLabel, onAction }) {
  return (
    <Paper sx={{ p: 4, textAlign: "center" }}>
      <Stack spacing={1.5} alignItems="center">
        <Typography variant="h6">{title}</Typography>
        {description ? (
          <Typography color="text.secondary">{description}</Typography>
        ) : null}
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}

export default EmptyStateCard;
