const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthCredentials(values, t) {
  const errors = {
    email: "",
    password: "",
  };

  const emailField = t("auth:fields.email");
  const passwordField = t("auth:fields.password");

  if (!values.email?.trim()) {
    errors.email = t("validation:requiredField", { field: emailField });
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = t("validation:invalidEmail");
  }

  if (!values.password?.trim()) {
    errors.password = t("validation:requiredField", {
      field: passwordField,
    });
  } else if (values.password.trim().length < 6) {
    errors.password = t("validation:minLength", {
      field: passwordField,
      count: 6,
    });
  }

  return errors;
}
