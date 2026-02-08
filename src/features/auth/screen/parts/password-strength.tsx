import { Show } from 'meemaw'
import { CheckCircle, Circle } from '@shared/icons/index.ts'
import { usePasswordStrength } from '../../hooks/use-password-strength.ts'

type PasswordStrengthProps = {
  password: string
}

const barColorMap: Record<string, string> = {
  WEAK: 'bg-status-error',
  MODERATE: 'bg-status-warning',
  STRONG: 'bg-primary',
  MAXIMUM: 'bg-primary',
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { requirements, passedCount, level } = usePasswordStrength(password)
  const barColor = barColorMap[level] ?? 'bg-border-light'

  return (
    <Show when={password.length > 0}>
      <div className="mt-3 space-y-3">
        {/* Strength bar */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < passedCount ? barColor : 'bg-border-light'
              }`}
            />
          ))}
          <span className="ml-2 text-[10px] uppercase tracking-wider text-text-secondary">
            LEVEL_{level}
          </span>
        </div>

        {/* Requirements grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-border-light bg-bg-primary p-3">
          {requirements.map((req) => (
            <div key={req.key} className="flex items-center gap-1.5">
              {req.passed ? (
                <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              ) : (
                <Circle className="h-3.5 w-3.5 flex-shrink-0 text-text-secondary" />
              )}
              <span
                className={`text-[11px] uppercase tracking-wider ${
                  req.passed ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Show>
  )
}
