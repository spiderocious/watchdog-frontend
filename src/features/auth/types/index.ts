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
  accepted_terms: boolean
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
