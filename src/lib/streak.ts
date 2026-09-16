import type { Habit, ScheduleType } from './types'
import { addDays, dayOfWeek, todayString } from './dateUtils'

export function isScheduledOnDate(
  scheduleType: ScheduleType,
  customDays: number[],
  date: string,
): boolean {
  const day = dayOfWeek(date)

  if (scheduleType === 'DAILY') {
    return true
  }

  if (scheduleType === 'WEEKDAYS') {
    return day >= 1 && day <= 5
  }

  return customDays.includes(day)
}

function scheduledDatesBetween(
  habit: Habit,
  start: string,
  end: string,
): string[] {
  const dates: string[] = []

  let cursor = start

  while (cursor <= end) {
    if (
      isScheduledOnDate(
        habit.scheduleType,
        habit.customDays,
        cursor,
      )
    ) {
      dates.push(cursor)
    }

    cursor = addDays(cursor, 1)
  }

  return dates
}

/**
 * Computes both streak values from the completion log.
 *
 * Nothing is stored as a mutable streak counter.
 *
 * Today is special:
 * if today is scheduled but incomplete, it is ignored as a break
 * until the day has passed.
 */
export function calculateStreaks(
  habit: Habit,
  asOf: string = todayString(),
): {
  current: number
  best: number
} {
  if (
    habit.createdDate > asOf ||
    (
      habit.scheduleType === 'CUSTOM' &&
      habit.customDays.length === 0
    )
  ) {
    return {
      current: 0,
      best: 0,
    }
  }

  const completionSet = new Set(habit.completions)

  const scheduledDates = scheduledDatesBetween(
    habit,
    habit.createdDate,
    asOf,
  )

  if (scheduledDates.length === 0) {
    return {
      current: 0,
      best: 0,
    }
  }

  /*
   * Best streak:
   *
   * Every scheduled day in a run must be completed.
   */
  let best = 0
  let run = 0

  for (const date of scheduledDates) {
    if (completionSet.has(date)) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 0
    }
  }

  /*
   * Current streak:
   *
   * Start from the latest scheduled day that can currently count.
   *
   * If today is scheduled but incomplete, don't treat today as a
   * miss yet. Instead inspect the previous scheduled date.
   */
  let index = scheduledDates.length - 1

  if (
    scheduledDates[index] === asOf &&
    !completionSet.has(asOf)
  ) {
    index -= 1
  }

  if (
    index < 0 ||
    !completionSet.has(scheduledDates[index])
  ) {
    return {
      current: 0,
      best,
    }
  }

  let current = 0

  for (let i = index; i >= 0; i -= 1) {
    if (!completionSet.has(scheduledDates[i])) {
      break
    }

    current += 1
  }

  return {
    current,
    best,
  }
}