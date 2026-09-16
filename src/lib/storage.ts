import type { AppData, Habit, ScheduleType } from './types'
import { todayString } from './dateUtils'

export const STORAGE_KEY =
  'streakly-habit-tracker-v1'

function makeId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

const EMPTY_DATA = (): AppData => ({
  challengeStartDate: todayString(),
  habits: [],
})

function isDateString(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isScheduleType(value: unknown): value is ScheduleType {
  return value === 'DAILY' || value === 'WEEKDAYS' || value === 'CUSTOM'
}

function normalizeHabit(value: unknown): Habit | null {
  if (!value || typeof value !== 'object') return null

  const candidate = value as Partial<Habit>
  const customDays = Array.isArray(candidate.customDays)
    ? [...new Set(candidate.customDays.filter(day => Number.isInteger(day) && day >= 0 && day <= 6))]
    : []

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.name !== 'string' ||
    !candidate.name.trim() ||
    !isScheduleType(candidate.scheduleType) ||
    !isDateString(candidate.createdDate) ||
    (candidate.scheduleType === 'CUSTOM' && customDays.length === 0)
  ) {
    return null
  }

  const target = typeof candidate.target === 'number' && Number.isFinite(candidate.target) && candidate.target > 0
    ? candidate.target
    : undefined

  return {
    id: candidate.id,
    name: candidate.name.trim(),
    description: typeof candidate.description === 'string' ? candidate.description : '',
    scheduleType: candidate.scheduleType,
    customDays,
    target,
    unit: typeof candidate.unit === 'string' ? candidate.unit : '',
    emoji: typeof candidate.emoji === 'string' && candidate.emoji ? candidate.emoji : '✨',
    color: typeof candidate.color === 'string' && candidate.color ? candidate.color : '#f97316',
    createdDate: candidate.createdDate,
    archived: candidate.archived === true,
    completions: Array.isArray(candidate.completions)
      ? [...new Set(candidate.completions.filter(isDateString))].sort()
      : [],
  }
}

export function loadAppData(): AppData {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return EMPTY_DATA()
    }

    const parsed = JSON.parse(raw) as AppData

    if (
      !parsed ||
      !Array.isArray(parsed.habits)
    ) {
      return EMPTY_DATA()
    }

    return {
      challengeStartDate: isDateString(parsed.challengeStartDate) ? parsed.challengeStartDate : todayString(),
      habits: parsed.habits.map(normalizeHabit).filter((habit): habit is Habit => habit !== null),
    }
  } catch {
    return EMPTY_DATA()
  }
}

export function saveAppData(
  data: AppData,
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data),
  )
}

export function clearAppData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function createHabit(
  input: Omit<Habit, 'id'>,
): Habit {
  return {
    ...input,
    id: makeId(),
  }
}