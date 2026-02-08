import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar.tsx'
import { TopBar } from './top-bar.tsx'
import { StatusFooter } from './status-footer.tsx'
import type { StatusOverview, DashboardMetadata } from '@features/dashboard/types/index.ts'

type AppLayoutProps = {
  statusOverview?: StatusOverview
  metadata?: DashboardMetadata
}

export function AppLayout({ statusOverview, metadata }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-primary">
      <TopBar
        statusOverview={statusOverview}
        metadata={metadata}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 flex h-full w-14 flex-col items-center border-r border-border-light bg-bg-primary py-4">
              <Sidebar />
            </aside>
          </div>
        )}

        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-3 md:p-4">
          <Outlet />
        </main>
      </div>

      <StatusFooter statusOverview={statusOverview} metadata={metadata} />
    </div>
  )
}
