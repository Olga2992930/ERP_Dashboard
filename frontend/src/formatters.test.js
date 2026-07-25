import { describe, expect, it } from 'vitest'
import { amountFormatter } from './formatters.js'

describe('amountFormatter', () => {
  it('uses Swedish separators and always displays two decimals', () => {
    const formatted = amountFormatter.format(1234.5).replace(/\s/gu, ' ')

    expect(formatted).toBe('1 234,50')
  })
})
