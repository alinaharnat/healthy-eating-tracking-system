import { Paper, Stack, Typography } from "@mui/material";

function PageIntroCard({ title, description }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h5">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  );
}

export default PageIntroCard;
