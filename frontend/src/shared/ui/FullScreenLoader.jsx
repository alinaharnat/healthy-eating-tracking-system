import { Box, CircularProgress, Typography } from "@mui/material";

function FullScreenLoader({ label = "Loading..." }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        bgcolor: "background.default",
      }}
    >
      <CircularProgress size={36} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

export default FullScreenLoader;
