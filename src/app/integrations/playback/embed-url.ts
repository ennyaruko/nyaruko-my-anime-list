/** The Kodik wrapper appends px to dimensions, so percentage values are invalid. */
export function kodikEmbedTemplate(template: string) {
  const url = new URL(template);
  for (const name of ["width", "height"] as const) {
    const value = url.searchParams.get(name);
    if (!value || value.includes("%")) url.searchParams.set(name, `:${name}`);
  }
  return url.href.replace(/%3A(width|height)/g, ":$1");
}
