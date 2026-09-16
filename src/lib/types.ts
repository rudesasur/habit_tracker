export type ScheduleType = 'DAILY' | 'WEEKDAYS' | 'CUSTOM'

export interface Habit {
  id: string
  name: string
  description: string
  scheduleType: ScheduleType
  customDays: number[]
  target?: number
  unit: string
  emoji: string
  color: string
  createdDate: string
  archived: boolean
  completions: string[]
}

export interface HabitDraft {
  name: string
  description: string
  scheduleType: ScheduleType
  customDays: number[]
  target: string
  unit: string
  emoji: string
  color: string
}

export interface AppData {
  challengeStartDate: string
  habits: Habit[]
}