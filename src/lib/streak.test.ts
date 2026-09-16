import { describe, expect, it } from 'vitest'
import {
  calculateStreaks,
  isScheduledOnDate,
} from './streak'
import type { Habit } from './types'

const base = (
  overrides: Partial<Habit> = {},
): Habit => ({
  id: 'h1',
  name: 'Read',
  description: '',
  scheduleType: 'DAILY',
  customDays: [],
  unit: '',
  emoji: '📚',
  color: '#6366f1',
  createdDate: '2026-09-01',
  archived: false,
  completions: [],
  ...overrides,
})

describe('isScheduledOnDate', () => {
  it('schedules every day for DAILY', () => {
    expect(
      isScheduledOnDate(
        'DAILY',
        [],
        '2026-09-13',
      ),
    ).toBe(true)
  })

  it('schedules Monday-Friday for WEEKDAYS', () => {
    expect(
      isScheduledOnDate(
        'WEEKDAYS',
        [],
        '2026-09-14',
      ),
    ).toBe(true)

    expect(
      isScheduledOnDate(
        'WEEKDAYS',
        [],
        '2026-09-13',
      ),
    ).toBe(false)
  })

  it('supports CUSTOM days and zero-day custom schedules', () => {
    expect(
      isScheduledOnDate(
        'CUSTOM',
        [1, 3, 5],
        '2026-09-14',
      ),
    ).toBe(true)

    expect(
      isScheduledOnDate(
        'CUSTOM',
        [],
        '2026-09-14',
      ),
    ).toBe(false)
  })
})

describe('calculateStreaks', () => {
  it('counts a normal daily current and best streak', () => {
    const habit = base({
      completions: [
        '2026-09-12',
        '2026-09-13',
        '2026-09-14',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 3,
      best: 3,
    })
  })

  it('does not break current streak when today is unticked', () => {
    const habit = base({
      completions: [
        '2026-09-12',
        '2026-09-13',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 2,
      best: 2,
    })
  })

  it('returns zero current streak after a missed day', () => {
    const habit = base({
      completions: [
        '2026-09-11',
        '2026-09-12',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 0,
      best: 2,
    })
  })

  it('ignores weekends for weekday habits', () => {
    const habit = base({
      scheduleType: 'WEEKDAYS',
      completions: [
        '2026-09-10',
        '2026-09-11',
        '2026-09-14',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 3,
      best: 3,
    })
  })

  it('does not count an unscheduled custom day as a miss', () => {
    const habit = base({
      scheduleType: 'CUSTOM',
      customDays: [1, 3, 5],
      completions: [
        '2026-09-11',
        '2026-09-14',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-15',
      ),
    ).toEqual({
      current: 2,
      best: 2,
    })
  })

  it('handles a custom schedule with zero selected days', () => {
    const habit = base({
      scheduleType: 'CUSTOM',
      customDays: [],
      completions: ['2026-09-14'],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 0,
      best: 0,
    })
  })

  it("doesn't create a broken streak for a habit created today", () => {
    const habit = base({
      createdDate: '2026-09-14',
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 0,
      best: 0,
    })
  })

  it('counts today immediately when completed', () => {
    const habit = base({
      completions: [
        '2026-09-13',
        '2026-09-14',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 2,
      best: 2,
    })
  })

  it('preserves best streak after a later break', () => {
    const habit = base({
      completions: [
        '2026-09-01',
        '2026-09-02',
        '2026-09-03',
        '2026-09-06',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-06',
      ),
    ).toEqual({
      current: 1,
      best: 3,
    })
  })

  it('preserves streak history for archived habits', () => {
    const habit = base({
      archived: true,
      completions: [
        '2026-09-12',
        '2026-09-13',
      ],
    })

    expect(
      calculateStreaks(
        habit,
        '2026-09-14',
      ),
    ).toEqual({
      current: 2,
      best: 2,
    })
  })
})