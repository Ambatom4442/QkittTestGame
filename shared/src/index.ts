export function formatCaseId(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
