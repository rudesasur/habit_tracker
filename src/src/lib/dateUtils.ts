export const DAY_LABELS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const

export function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayString(): string {
  return toDateString(new Date())
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export function addDays(value: string, amount: number): string {
  const date = parseLocalDate(value)

  date.setDate(date.getDate() + amount)

  return toDateString(date)
}

export function compareDates(a: string, b: string): number {
  return a.localeCompare(b)
}

export function dayOfWeek(value: string): number {
  return parseLocalDate(value).getDay()
}

export function formatDate(
  value: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return parseLocalDate(value).toLocaleDateString(
    undefined,
    options ?? {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    },
  )
}

export function formatShortDate(value: string): string {
  return parseLocalDate(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function daysBetweenInclusive(
  start: string,
  end: string,
): number {
  if (start > end) return 0

  let count = 0
  let cursor = start

  while (cursor <= end) {
    count += 1
    cursor = addDays(cursor, 1)
  }

  return count
}

export function clampDate(
  value: string,
  min: string,
  max: string,
): string {
  if (value < min) return min
  if (value > max) return max

  return value
}