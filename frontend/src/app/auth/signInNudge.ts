/** Passed with `navigate(..., { state })` / `<Link state />` so LoginPage can show a nudge. */
export type SignInLocationState = {
  signInHint?: string
}

export function protectedRouteSignInHint(returnPath: string): string {
  const label = returnPath.split('?')[0] || returnPath
  return `Sign in to open ${label}. After OTP you’ll return here.`
}
