/**
 * Detects Next.js's internal redirect signal so client-side `try/catch`
 * blocks can re-throw it and let the framework finish the navigation.
 *
 * `redirect()` called inside a Server Action throws an error whose `digest`
 * starts with `"NEXT_REDIRECT"`. If a client `catch` swallows it, the user
 * sees the action appear to "fail" before navigation eventually happens.
 */
export function isNextRedirectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}
