/**
 * Date utility functions
 */

/**
 * Add days to a date
 *
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculate days difference between two dates
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Absolute number of days between dates
 */
export function daysDifference(
  date1: Date | string,
  date2: Date | string,
): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  return Math.ceil(diff / oneDay);
}

/**
 * Calculate days overdue (0 if not overdue)
 *
 * @param dueDate - The due date to check
 * @returns Number of days overdue, or 0 if not overdue
 */
export function daysOverdue(dueDate: Date | string): number {
  const now = new Date();
  const due = new Date(dueDate);

  if (now <= due) {
    return 0;
  }

  return daysDifference(now, due);
}
