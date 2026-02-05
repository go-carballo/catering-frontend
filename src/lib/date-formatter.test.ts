import { describe, it, expect } from 'vitest'
import {
  formatDateShort,
  formatDateFull,
  isToday,
  isYesterday,
  getCurrentMonthName,
  getCurrentMonthYear,
} from '@/lib/date-formatter'

describe('Date Formatter', () => {
  describe('formatDateShort', () => {
    it('should format today as "Hoy"', () => {
      const today = new Date().toISOString()
      expect(formatDateShort(today)).toBe('Hoy')
    })

    it('should format yesterday as "Ayer"', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(formatDateShort(yesterday.toISOString())).toBe('Ayer')
    })

    it('should format other dates with day and month', () => {
      const pastDate = new Date('2024-01-15').toISOString()
      const result = formatDateShort(pastDate)
      // Format is "lun, 15 ene" or similar
      expect(result).toMatch(/\w+,?\s+\d+\s+\w+/)
    })
  })

  describe('formatDateFull', () => {
    it('should format date with full details', () => {
      const date = new Date('2024-02-05').toISOString()
      const result = formatDateFull(date)
      expect(result).toContain('febrero')
      expect(result).toContain('2024')
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date().toISOString()
      expect(isToday(today)).toBe(true)
    })

    it('should return false for yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isToday(yesterday.toISOString())).toBe(false)
    })

    it('should return false for future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(isToday(tomorrow.toISOString())).toBe(false)
    })
  })

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isYesterday(yesterday.toISOString())).toBe(true)
    })

    it('should return false for today', () => {
      const today = new Date().toISOString()
      expect(isYesterday(today)).toBe(false)
    })

    it('should return false for two days ago', () => {
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      expect(isYesterday(twoDaysAgo.toISOString())).toBe(false)
    })
  })

  describe('getCurrentMonthName', () => {
    it('should return current month name in Spanish', () => {
      const result = getCurrentMonthName()
      const months = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ]
      expect(months).toContain(result)
    })
  })

  describe('getCurrentMonthYear', () => {
    it('should return month and year', () => {
      const result = getCurrentMonthYear()
      const year = new Date().getFullYear().toString()
      expect(result).toContain(year)
    })
  })
})
