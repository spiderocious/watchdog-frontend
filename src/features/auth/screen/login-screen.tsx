import { LoginForm } from './parts/login-form.tsx'

export function LoginScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <LoginForm />
      </main>
    </div>
  )
}
