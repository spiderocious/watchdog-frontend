import { Monitor } from '@shared/icons/index.ts'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

const sizeMap = {
  sm: { icon: 'h-5 w-5', text: 'text-base', tagline: 'text-[10px]' },
  md: { icon: 'h-6 w-6', text: 'text-lg', tagline: 'text-xs' },
  lg: { icon: 'h-8 w-8', text: 'text-2xl', tagline: 'text-xs' },
} as const

export function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const s = sizeMap[size]

  return (
    <div className="flex items-center gap-2">
      <Monitor className={`${s.icon} text-primary`} />
      <div className="flex flex-col">
        <span
          className={`${s.text} font-bold uppercase tracking-wider text-text-white`}
        >
          WatchDog
        </span>
        {showTagline && (
          <span
            className={`${s.tagline} font-medium uppercase tracking-wide text-primary`}
          >
            Uptime Monitoring
          </span>
        )}
      </div>
    </div>
  )
}
