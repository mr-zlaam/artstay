export function replaceAllPlaceholders(template: string, placeholders: Record<string, string>): string {
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    template = template.replace(regex, value || "");
  }
  return template;
}
