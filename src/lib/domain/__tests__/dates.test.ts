import { describe, it, expect } from 'vitest'
import { daysUntil, isPast, startOfToday } from '@/lib/domain/dates'

// format for Date(...) is YEAR, MONTH, DAY, HOUR, MINUTE.
const today = startOfToday(new Date(2026, 10, 20, 21, 0))

describe('dates', () => {
  it('startOfToday returns local midnight', () => {
    expect(today.getHours()).toBe(0)
    expect(today.getDate()).toBe(20)
  })

  it('counts tomorrow as 1 day away', () => {
    expect(daysUntil('2026-11-21', today)).toBe(1)
  })

  it('counts yesterday as -1', () => {
    expect(daysUntil('2026-11-19', today)).toBe(-1)
  })
})

describe('dates known bugs (fixed in Sprint 4)', () => {
  it.fails('does not treat an item expiring today as past', () => {
    expect(isPast('2026-11-20', today)).toBe(false)
  })

  it.fails('never counts an item as both expired and expiring soon', () => {
    const d = '2026-11-20'
    const expiringSoon = daysUntil(d, today) >= 0 && daysUntil(d, today) <= 3
    expect(isPast(d, today) && expiringSoon).toBe(false)
  })
})
