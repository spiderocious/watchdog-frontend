import { useMemo } from 'react'
import type { PasswordRequirement, PasswordStrengthLevel } from '../types/index.ts'

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    key: 'length',
    label: 'CHAR_COUNT > 12',
    test: (pw) => pw.length >= 12,
  },
  {
    key: 'uppercase',
    label: 'UPPERCASE_REQUIRED',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: 'numeric',
    label: 'NUMERIC_VALUE',
    test: (pw) => /\d/.test(pw),
  },
  {
    key: 'symbol',
    label: 'SYMBOL_SET',
    test: (pw) => /[^a-zA-Z0-9]/.test(pw),
  },
]

function getStrengthLevel(passedCount: number): PasswordStrengthLevel {
  if (passedCount === 0) return 'NONE'
  if (passedCount === 1) return 'WEAK'
  if (passedCount === 2) return 'MODERATE'
  if (passedCount === 3) return 'STRONG'
  return 'MAXIMUM'
}

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const results = PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      passed: password.length > 0 ? req.test(password) : false,
    }))

    const passedCount = results.filter((r) => r.passed).length

    return {
      requirements: results,
      passedCount,
      level: getStrengthLevel(passedCount),
      isStrong: passedCount === PASSWORD_REQUIREMENTS.length,
    }
  }, [password])
}
