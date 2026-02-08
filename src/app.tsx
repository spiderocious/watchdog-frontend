import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './app.routes.ts'

const router = createBrowserRouter(routes)

export function App() {
  return <RouterProvider router={router} />
}
