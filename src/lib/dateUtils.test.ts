import { describe, expect, it } from 'vitest'
import {
  addDays,
  dayOfWeek,
  toDateString,
} from './dateUtils'

describe('date utils', () => {
  it('formats local dates without UTC conversion', () => {
    const date = new Date(2026, 8, 16)

    expect(
      toDateString(date),
    ).toBe('2026-09-16')
  })

  it('adds calendar days in local time', () => {
    expect(
      addDays(
        '2026-09-16',
        1,
      ),
    ).toBe('2026-09-17')

    expect(
      addDays(
        '2026-09-16',
        -1,
      ),
    ).toBe('2026-09-15')
  })

  it('uses JavaScript local weekday numbering', () => {
    expect(
      dayOfWeek('2026-09-14'),
    ).toBe(1)
  })
})