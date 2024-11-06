import {test, expect} from 'vitest'
import { cn } from '../classnames.utils'

test('should override classnames properly', () => {
  const baseClasses = 'p-0'
  const inputClasses = 'p-4'

  const result = cn(baseClasses, inputClasses)
  expect(result).toBe('p-4')
})
