import { CircularProgress, Paper, Stack, Typography } from "@mui/material";

function SectionLoadingState({ label }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <CircularProgress size={18} />
        <Typography>{label}</Typography>
      </Stack>
    </Paper>
  );
}

export default SectionLoadingState;
