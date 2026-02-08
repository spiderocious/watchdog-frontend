import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Show } from 'meemaw'
import {
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Check,
  Monitor,
  LogIn,
  Loader2,
} from '@shared/icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import type { ApiErrorResponse } from '@shared/types/index.ts'
import type { LoginFormData } from '../../types/index.ts'
import { useLoginMutation } from '../../api/use-login-mutation.ts'

const INPUT_BASE =
  'w-full rounded-lg border bg-bg-primary py-3.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none'
const INPUT_NORMAL = `${INPUT_BASE} border-border-light focus:border-primary focus:ring-1 focus:ring-primary/20`
const INPUT_ERROR = `${INPUT_BASE} border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error/20`
const ICON_LEFT =
  'absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary'

export function LoginForm() {
  const navigate = useNavigate()
  const mutation = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember_me: false,
  })

  const isFormValid =
    formData.email.includes('@') && formData.password.length >= 1

  function updateField<K extends keyof LoginFormData>(
    key: K,
    value: LoginFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function getError(): string | undefined {
    const error = mutation.error as unknown as ApiErrorResponse | undefined
    if (!error) return undefined
    return error.message
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate(
      {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.DASHBOARD)
        },
      },
    )
  }

  const errorMessage = getError()
  const hasError = !!errorMessage

  return (
    <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-border-light bg-bg-secondary">
      {/* Green top border accent */}
      <div className="h-1 w-full bg-primary" />

      <div className="p-8 md:p-10">
        {/* Centered logo icon */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border-medium">
            <Monitor className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold uppercase tracking-wider text-text-white">
              System Access
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Enter your credentials to continue
            </p>
          </div>
        </div>

        {/* Error */}
        <Show when={hasError}>
          <div className="mb-6 rounded-lg border border-status-error/30 bg-status-error/10 px-4 py-3">
            <span className="text-xs uppercase tracking-wider text-status-error">
              {errorMessage}
            </span>
          </div>
        </Show>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">
              Email Address
            </label>
            <div className="relative">
              <AtSign className={ICON_LEFT} />
              <input
                type="email"
                placeholder="user@monitor.central"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={hasError ? INPUT_ERROR : INPUT_NORMAL}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">
              Password
            </label>
            <div className="relative">
              <Lock className={ICON_LEFT} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={`${hasError ? INPUT_ERROR : INPUT_NORMAL} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-secondary"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.remember_me}
                onChange={(e) => updateField('remember_me', e.target.checked)}
                className="sr-only"
              />
              <div
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                  formData.remember_me
                    ? 'border-primary bg-primary'
                    : 'border-border-light bg-bg-primary'
                }`}
              >
                <Show when={formData.remember_me}>
                  <Check className="h-3 w-3 text-primary-text" />
                </Show>
              </div>
              <span className="text-xs text-text-secondary">Remember me</span>
            </label>

            <a
              href="#"
              className="text-xs text-primary transition-colors hover:text-primary-hover"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || mutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-primary-text transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Show
              when={!mutation.isPending}
              fallback={
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              }
            >
              Login
              <LogIn className="h-4 w-4" />
            </Show>
          </button>

          {/* Sign up link */}
          <p className="text-center text-xs uppercase tracking-wider text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link
              to={ROUTES.AUTH.REGISTER}
              className="font-bold text-primary transition-colors hover:text-primary-hover"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
