import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDashboardOverview } from '@features/dashboard/api/use-dashboard-overview.ts'
import { Sidebar, MobileSidebar } from './sidebar.tsx'
import { TopBar } from './top-bar.tsx'
import { StatusFooter } from './status-footer.tsx'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data } = useDashboardOverview()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-primary">
      <TopBar
        statusOverview={data?.status_overview}
        metadata={data?.metadata}
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
            <div className="relative z-50">
              <MobileSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-3 md:p-4">
          <Outlet />
        </main>
      </div>

      <StatusFooter statusOverview={data?.status_overview} metadata={data?.metadata} />
    </div>
  )
}
