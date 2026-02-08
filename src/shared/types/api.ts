export type ApiSuccessResponse<T> = {
  success: true
  message: string
  data: T
}

export type ApiErrorResponse = {
  success: false
  error: string
  message: string
  fields?: ApiFieldError[]
}

export type ApiFieldError = {
  type: string
  value: string
  msg: string
  path: string
  location: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
