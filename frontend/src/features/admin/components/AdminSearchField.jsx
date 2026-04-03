import { TextField } from "@mui/material";

const ADMIN_SEARCH_FIELD_SX = {
  maxWidth: 320,
  "& .MuiOutlinedInput-root": {
    bgcolor: "common.white",
    "& fieldset": {
      borderColor: "rgba(15, 23, 42, 0.28)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(15, 23, 42, 0.48)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: 1,
    },
  },
  "& .MuiInputBase-input": {
    color: "text.primary",
  },
  "& .MuiInputLabel-root": {
    color: "text.secondary",
  },
};

function AdminSearchField({ sx, ...props }) {
  return (
    <TextField
      size="small"
      sx={{ ...ADMIN_SEARCH_FIELD_SX, ...sx }}
      {...props}
    />
  );
}

export default AdminSearchField;
