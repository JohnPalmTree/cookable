const MS_PER_DAY = 1000 * 60 * 60 * 24

// Midnight at the start of `now`'s day, in local time.
export function startOfToday(now: Date = new Date()): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d
}

/*
 - whole days from `today` until the expiry date, rounded up.
 - copied as-is. known bug (Sprint 4): new Date('YYYY-MM-DD') is read as midnight UTC, not local midnight.
 */

export function daysUntil(dateStr: string, today: Date): number {
  return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / MS_PER_DAY)
}

/** True if the expiry moment is before `today`. Same UTC bug as above. */
export function isPast(dateStr: string, today: Date): boolean {
  return new Date(dateStr) < today
}