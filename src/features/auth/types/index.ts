export type RegisterPayload = {
  full_name: string
  email: string
  password: string
}

export type RegisterFormData = {
  full_name: string
  email: string
  password: string
  confirm_password: string
}

export type PasswordRequirement = {
  key: string
  label: string
  test: (password: string) => boolean
}

export type PasswordStrengthLevel =
  | 'NONE'
  | 'WEAK'
  | 'MODERATE'
  | 'STRONG'
  | 'MAXIMUM'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginFormData = {
  email: string
  password: string
  remember_me: boolean
}
