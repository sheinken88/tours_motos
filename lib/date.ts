const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseCalendarDate(date: string): Date {
  return new Date(DATE_ONLY_RE.test(date) ? `${date}T12:00:00` : date);
}
