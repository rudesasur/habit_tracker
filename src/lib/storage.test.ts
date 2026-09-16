import { beforeEach, describe, expect, it } from 'vitest'
import { loadAppData, STORAGE_KEY } from './storage'

describe('localStorage repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('drops malformed habits and normalizes duplicate completion dates', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      challengeStartDate: '2026-09-16',
      habits: [
        {
          id: 'valid',
          name: 'Read',
          scheduleType: 'DAILY',
          customDays: [],
          createdDate: '2026-09-01',
          archived: false,
          completions: ['2026-09-02', '2026-09-02', 'not-a-date'],
        },
        {
          id: 'invalid',
          name: 'No custom days',
          scheduleType: 'CUSTOM',
          customDays: [],
          createdDate: '2026-09-01',
        },
      ],
    }))

    const data = loadAppData()

    expect(data.habits).toHaveLength(1)
    expect(data.habits[0].completions).toEqual(['2026-09-02'])
  })

  it('returns a safe empty state for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{broken')

    expect(loadAppData().habits).toEqual([])
  })
})