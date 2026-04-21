export function makeSlug(title) {
  return title
    .toLowerCase()                 // lowercase
    .trim()                       // remove extra spaces
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")         // spaces to hyphen
    .replace(/-+/g, "-");         // remove duplicate hyphens
}