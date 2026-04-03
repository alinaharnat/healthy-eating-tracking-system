function appendParam(searchParams, key, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((arrayValue) => appendParam(searchParams, key, arrayValue));
    return;
  }

  if (value instanceof Date) {
    searchParams.append(key, value.toISOString());
    return;
  }

  searchParams.append(key, String(value));
}

export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    appendParam(searchParams, key, value);
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}
