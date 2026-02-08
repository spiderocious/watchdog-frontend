import { Check } from '@icons/index.ts'

type Step = {
  label: string
}

type WizardStepperProps = {
  steps: Step[]
  current: number
}

export function WizardStepper({ steps, current }: WizardStepperProps) {
  const progress = ((current + 1) / steps.length) * 100

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Step {current + 1} of {steps.length}
          </span>
          <h2 className="text-xl font-bold uppercase tracking-wider text-text-white">
            {steps[current].label}
          </h2>
        </div>
        <span className="font-mono text-2xl font-bold text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-bg-tertiary"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                i <= current ? 'bg-primary' : ''
              }`}
              style={{ width: i <= current ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i < current ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-bg-primary" />
              </div>
            ) : (
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                  i === current
                    ? 'border-primary bg-primary text-bg-primary'
                    : 'border-border-light text-text-secondary'
                }`}
              >
                {i + 1}
              </div>
            )}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                i <= current ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
