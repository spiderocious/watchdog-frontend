import { Outlet } from 'react-router-dom'
import { AppProvider } from './app.provider.tsx'

export function AppEntrypoint() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  )
}
