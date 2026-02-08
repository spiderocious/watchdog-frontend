import { RegistrationForm } from './parts/registration-form.tsx'
import { RegistrationFooter } from './parts/registration-footer.tsx'

export function RegisterScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <RegistrationForm />
      </main>
      <RegistrationFooter />
    </div>
  )
}
