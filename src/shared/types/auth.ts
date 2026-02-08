export type User = {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at: string
}

export type AuthData = {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}
