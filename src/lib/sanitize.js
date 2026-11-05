// Helpers for public routes that take input from anyone on the internet.

// Copies only the listed fields, and only when they are strings. Anything
// else (extra fields, File uploads, objects) is dropped.
export function pickStrings(source, fields, maxLength = 2000) {
  const picked = {};
  for (const field of fields) {
    const value = source?.[field];
    if (typeof value === "string" && value.length <= maxLength) {
      picked[field] = value;
    }
  }
  return picked;
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^\S+@\S+\.\S+$/.test(value)
  );
}

// For customer text placed inside HTML emails.
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
