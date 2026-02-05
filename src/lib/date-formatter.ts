/**
 * Format a date string to a human-readable format
 * Shows "Hoy" for today, "Ayer" for yesterday, or the formatted date
 * @param dateStr - ISO date string
 * @returns Formatted date string
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  } else {
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
}

/**
 * Format a date to full format
 * @param dateStr - ISO date string
 * @returns Formatted full date
 */
export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format a date to ISO format
 * @param date - Date object or ISO string
 * @returns ISO format string
 */
export function toISODate(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

/**
 * Check if a date is today
 * @param dateStr - ISO date string
 * @returns True if the date is today
 */
export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is yesterday
 * @param dateStr - ISO date string
 * @returns True if the date is yesterday
 */
export function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

/**
 * Get the current month name in Spanish
 * @returns Month name (e.g., "enero", "febrero")
 */
export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString("es-AR", { month: "long" });
}

/**
 * Get the current month and year
 * @returns Formatted string (e.g., "febrero de 2026")
 */
export function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}
