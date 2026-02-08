import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Show } from 'meemaw'
import {
  User,
  AtSign,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Loader2,
} from '@shared/icons/index.ts'
import { ROUTES } from '@shared/constants/routes.ts'
import type { ApiErrorResponse } from '@shared/types/index.ts'
import type { RegisterFormData } from '../../types/index.ts'
import { useRegisterMutation } from '../../api/use-register-mutation.ts'
import { PasswordStrength } from './password-strength.tsx'

const INPUT_BASE =
  'w-full rounded-lg border bg-bg-primary py-3.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:outline-none'
const INPUT_NORMAL = `${INPUT_BASE} border-border-light focus:border-primary focus:ring-1 focus:ring-primary/20`
const INPUT_ERROR = `${INPUT_BASE} border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error/20`
const ICON_LEFT = 'absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted'

export function RegistrationForm() {
  const navigate = useNavigate()
  const mutation = useRegisterMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    accepted_terms: false,
  })

  const passwordsMatch =
    formData.confirm_password.length > 0 &&
    formData.password === formData.confirm_password
  const passwordsMismatch =
    formData.confirm_password.length > 0 &&
    formData.password !== formData.confirm_password

  const isFormValid =
    formData.full_name.trim().length >= 2 &&
    formData.email.includes('@') &&
    formData.password.length >= 8 &&
    passwordsMatch &&
    formData.accepted_terms

  function updateField<K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function getFieldError(fieldPath: string): string | undefined {
    const error = mutation.error as unknown as ApiErrorResponse | undefined
    if (!error) return undefined
    if (error.error === 'EMAIL_TAKEN' && fieldPath === 'email') {
      return error.message
    }
    if (!error.fields) return undefined
    const fieldError = error.fields.find((f) => f.path === fieldPath)
    return fieldError?.msg
  }

  function getGlobalError(): string | undefined {
    const error = mutation.error as unknown as ApiErrorResponse | undefined
    if (!error) return undefined
    if (error.error === 'EMAIL_TAKEN') return undefined
    if (error.error === 'VALIDATION_ERROR') return undefined
    return error.message || 'SYSTEM_ERROR: CONNECTION_FAILED'
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate(
      {
        full_name: formData.full_name.trim(),
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

  const globalError = getGlobalError()
  const fullNameError = getFieldError('full_name')
  const emailError = getFieldError('email')
  const passwordError = getFieldError('password')

  return (
    <div className="w-full max-w-[700px] rounded-lg border border-border-light border-l-2 border-l-primary/30 bg-bg-secondary p-6 md:p-10">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-text-white">
          Operator Registration
        </h1>
        <span className="mt-1 whitespace-nowrap text-[11px] uppercase tracking-wider text-primary">
          ID_SECURE_PROTO_V3
        </span>
      </div>
      <p className="mb-8 text-sm text-text-secondary">
        Provision a new operator profile for regional sector monitoring.
      </p>

      {/* Global error */}
      <Show when={!!globalError}>
        <div className="mb-6 rounded-lg border border-status-error/30 bg-status-error/10 px-4 py-3">
          <span className="text-xs uppercase tracking-wider text-status-error">
            {globalError}
          </span>
        </div>
      </Show>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-primary">
            Full Name
          </label>
          <div className="relative">
            <User className={ICON_LEFT} />
            <input
              type="text"
              placeholder="OPERATOR_FULL_NAME"
              autoComplete="name"
              value={formData.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              className={fullNameError ? INPUT_ERROR : INPUT_NORMAL}
            />
          </div>
          <Show when={!!fullNameError}>
            <p className="text-[11px] uppercase tracking-wider text-status-error">
              {fullNameError}
            </p>
          </Show>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-primary">
            Email Address
          </label>
          <div className="relative">
            <AtSign className={ICON_LEFT} />
            <input
              type="email"
              placeholder="operator@system.local"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={emailError ? INPUT_ERROR : INPUT_NORMAL}
            />
          </div>
          <Show when={!!emailError}>
            <p className="text-[11px] uppercase tracking-wider text-status-error">
              {emailError}
            </p>
          </Show>
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
              placeholder="••••••••••••"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              className={`${passwordError ? INPUT_ERROR : INPUT_NORMAL} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <Show when={!!passwordError}>
            <p className="text-[11px] uppercase tracking-wider text-status-error">
              {passwordError}
            </p>
          </Show>
          <PasswordStrength password={formData.password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-primary">
            Confirm Password
          </label>
          <div className="relative">
            <ShieldCheck className={ICON_LEFT} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="new-password"
              value={formData.confirm_password}
              onChange={(e) => updateField('confirm_password', e.target.value)}
              className={`${passwordsMismatch ? INPUT_ERROR : INPUT_NORMAL} pr-11`}
            />
            <Show when={passwordsMatch}>
              <Check className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            </Show>
            <Show when={!passwordsMatch}>
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </Show>
          </div>
          <Show when={passwordsMismatch}>
            <p className="text-[11px] uppercase tracking-wider text-status-error">
              PASSWORDS DO NOT MATCH
            </p>
          </Show>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.accepted_terms}
            onChange={(e) => updateField('accepted_terms', e.target.checked)}
            className="sr-only"
          />
          <div
            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
              formData.accepted_terms
                ? 'border-primary bg-primary'
                : 'border-border-light bg-bg-primary'
            }`}
          >
            <Show when={formData.accepted_terms}>
              <Check className="h-3 w-3 text-primary-text" />
            </Show>
          </div>
          <span className="text-xs leading-relaxed text-text-secondary">
            I confirm my identity as a licensed systems operator and agree to the{' '}
            <a href="#" className="text-primary underline hover:text-primary-hover">
              System Protocols
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary underline hover:text-primary-hover">
              Data Encryption Policies
            </a>
            .
          </span>
        </label>

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
                Processing...
              </>
            }
          >
            Continue to Profile Setup
          </Show>
        </button>

        {/* Sign in link */}
        <p className="text-center text-xs uppercase tracking-wider text-text-secondary">
          Already have an account?{' '}
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="font-bold text-primary transition-colors hover:text-primary-hover"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
