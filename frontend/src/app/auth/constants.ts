/** v0.1 demo only — do not use in production */
export const DEMO_EMAIL = '7.ashutoshj@gmail.com'
export const DEMO_PASSWORD = 'altcode@123'
export const DEMO_OTP = '888888'

export const AUTH_FLAG_KEY = 'altcode_auth'
export const RETURN_URL_KEY = 'altcode_return_url'
/** Set after email+password ok; required before OTP route is valid */
export const OTP_PENDING_KEY = 'altcode_otp_pending'

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_FLAG_KEY) === '1'
}

export function setAuthenticated(value: boolean): void {
  if (value) sessionStorage.setItem(AUTH_FLAG_KEY, '1')
  else sessionStorage.removeItem(AUTH_FLAG_KEY)
}
