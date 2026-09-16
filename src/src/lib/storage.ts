import type {
  AppData,
  Habit,
} from './types'
import { todayString } from './dateUtils'

export const STORAGE_KEY =
  'streakly-habit-tracker-v1'

function makeId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

export function loadAppData(): AppData {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {
        challengeStartDate: todayString(),
        habits: [],
      }
    }

    const parsed = JSON.parse(raw) as AppData

    if (
      !parsed ||
      !Array.isArray(parsed.habits)
    ) {
      return {
        challengeStartDate: todayString(),
        habits: [],
      }
    }

    return {
      challengeStartDate:
        parsed.challengeStartDate ||
        todayString(),
      habits: parsed.habits,
    }
  } catch {
    return {
      challengeStartDate: todayString(),
      habits: [],
    }
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