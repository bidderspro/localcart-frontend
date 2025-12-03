type LocalUser = {
  id: string
  name?: string
  email?: string
  phone?: string
  password?: string
  role?: string
}

type AuthSession = {
  userId: string
  role?: string
}

const USERS_KEY = "lc-users"
const AUTH_KEY = "lc-auth-session"
const OTP_KEY = "lc-phone-otp"
const ACCESS_TOKEN_KEY = "lc-access-token"
const REFRESH_TOKEN_KEY = "lc-refresh-token"

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function getUsers(): LocalUser[] {
  if (typeof window === "undefined") return []
  return safeParse<LocalUser[]>(window.localStorage.getItem(USERS_KEY), [])
}

function saveUsers(users: LocalUser[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function markAuthenticated(role?: string, userId?: string) {
  if (typeof window === "undefined") return
  const session: AuthSession = {
    userId: userId ?? getAuthSession()?.userId ?? "token-user",
    role: role ?? getAuthSession()?.role,
  }
  setAuthSession(session)
}

export function clearAuth() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(AUTH_KEY)
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getAuthRole() {
  return getAuthSession()?.role ?? null
}

export function isAuthenticated() {
  return Boolean(getAuthSession() || hasStoredTokens())
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  const session = safeParse<AuthSession | null>(
    window.localStorage.getItem(AUTH_KEY),
    null
  )
  if (session && session.userId) return session
  if (hasStoredTokens()) {
    return { userId: "token-user" }
  }
  return null
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

function hasStoredTokens() {
  if (typeof window === "undefined") return false
  return Boolean(
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
      window.localStorage.getItem(REFRESH_TOKEN_KEY)
  )
}

export function setOtpForPhone(phone: string, code: string) {
  if (typeof window === "undefined") return
  const store = safeParse<Record<string, string>>(
    window.localStorage.getItem(OTP_KEY),
    {}
  )
  store[phone] = code
  window.localStorage.setItem(OTP_KEY, JSON.stringify(store))
}

export function getOtpForPhone(phone: string) {
  if (typeof window === "undefined") return null
  const store = safeParse<Record<string, string>>(
    window.localStorage.getItem(OTP_KEY),
    {}
  )
  return store[phone] ?? null
}

export function clearOtpForPhone(phone: string) {
  if (typeof window === "undefined") return
  const store = safeParse<Record<string, string>>(
    window.localStorage.getItem(OTP_KEY),
    {}
  )
  delete store[phone]
  window.localStorage.setItem(OTP_KEY, JSON.stringify(store))
}
