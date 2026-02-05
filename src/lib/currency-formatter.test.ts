import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCurrencyWithCents,
  parseCurrency,
} from '@/lib/currency-formatter'

describe('Currency Formatter', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as Argentine Peso', () => {
      const result = formatCurrency(1000)
      expect(result).toMatch(/\$\s*1\.000/) // Argentine format with space after $
    })

    it('should format large numbers with thousand separators', () => {
      const result = formatCurrency(1234567)
      expect(result).toMatch(/\$\s*1\.234\.567/)
    })

    it('should format zero as currency', () => {
      const result = formatCurrency(0)
      expect(result).toMatch(/\$\s*0/)
    })

    it('should format negative numbers', () => {
      const result = formatCurrency(-500)
      expect(result).toMatch(/-\$\s*500/)
    })

    it('should round decimal places', () => {
      const result = formatCurrency(1234.56)
      // Should be either 1234 or 1235 (rounding)
      expect(result).toMatch(/\$\s*1\.2\d+/)
    })
  })

  describe('formatCurrencyWithCents', () => {
    it('should format numbers with cents', () => {
      const result = formatCurrencyWithCents(1000.5)
      expect(result).toMatch(/\$\s*1\.000,50/)
    })

    it('should show two decimal places', () => {
      const result = formatCurrencyWithCents(100.1)
      expect(result).toMatch(/\$\s*100,10/)
    })

    it('should handle whole numbers', () => {
      const result = formatCurrencyWithCents(500)
      expect(result).toMatch(/\$\s*500,00/)
    })

    it('should format negative numbers with cents', () => {
      const result = formatCurrencyWithCents(-999.99)
      expect(result).toMatch(/-\$\s*999,99/)
    })
  })

  describe('parseCurrency', () => {
    it('should parse formatted currency string to number', () => {
      const result = parseCurrency('$ 1.000') // With space as in Argentina
      expect(result).toBe(1000)
    })

    it('should handle currency with cents', () => {
      const result = parseCurrency('$ 1.000,50')
      expect(result).toBe(1000.5)
    })

    it('should handle negative currency strings', () => {
      const result = parseCurrency('-$ 500')
      expect(result).toBe(-500)
    })

    it('should parse zero', () => {
      const result = parseCurrency('$ 0')
      expect(result).toBe(0)
    })
  })
})
