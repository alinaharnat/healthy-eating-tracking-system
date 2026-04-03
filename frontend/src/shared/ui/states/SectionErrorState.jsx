import { Alert, Button } from "@mui/material";

function SectionErrorState({ message, onRetry, retryLabel = "Retry" }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button size="small" color="inherit" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}

export default SectionErrorState;
