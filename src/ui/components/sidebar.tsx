import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  List,
  Network,
  Settings,
} from '@shared/icons/index.ts'
import type { LucideIcon } from '@shared/icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'

type NavItem = {
  icon: LucideIcon
  path: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, path: ROUTES.DASHBOARD, label: 'Dashboard' },
  { icon: Activity, path: '#', label: 'Activity' },
  { icon: ClipboardList, path: '#', label: 'Reports' },
  { icon: List, path: '#', label: 'Logs' },
  { icon: Network, path: ROUTES.SERVICES.ROOT, label: 'Services' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden w-14 flex-shrink-0 flex-col items-center border-r border-border-light bg-bg-primary py-4 md:flex">
      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && item.path !== '#'
          return (
            <Link
              key={item.label}
              to={item.path}
              title={item.label}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary'
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>

      <Link
        to="#"
        title="Settings"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </aside>
  )
}
