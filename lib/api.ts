const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "/api"

const ACCESS_TOKEN_KEY = "lc-access-token"
const REFRESH_TOKEN_KEY = "lc-refresh-token"
const LEGACY_TOKEN_KEY = "token"

type TokenBundle = {
  accessToken?: string
  refreshToken?: string
}

export type UserProfile = {
  id?: string
  role?: string
  currentRole?: string
  name?: string
  email?: string
  phone?: string
  is_verified?: boolean
  token_id?: string
  roleStatus?: string | null
  userId?: string
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  headers?: HeadersInit
  body?: any
  requireAuth?: boolean
  credentials?: RequestCredentials
}

type ApiError = {
  message: string
  status: number
}

function isBrowser() {
  return typeof window !== "undefined"
}

function parseJson(text: string | null, fallback: any) {
  if (!text) return fallback
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function getStoredTokens(): TokenBundle {
  if (!isBrowser()) return {}
  const legacyAccess = window.localStorage.getItem(LEGACY_TOKEN_KEY) || undefined
  return {
    accessToken:
      window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
      legacyAccess ||
      undefined,
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY) || undefined,
  }
}

export function saveTokens(tokens: TokenBundle) {
  if (!isBrowser()) return
  const access = tokens.accessToken ?? tokens.refreshToken
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    // Write legacy key for compatibility with any older callers
    window.localStorage.setItem(LEGACY_TOKEN_KEY, tokens.accessToken)
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }
}

export function saveTokensFromResponse(response: any) {
  // Accept multiple backend shapes to reduce 401s from missing Authorization
  const source =
    response?.data && typeof response.data === "object"
      ? response.data
      : response

  const accessToken =
    source?.accessToken ||
    source?.token ||
    source?.token?.token ||
    source?.token?.accessToken ||
    source?.tokens?.accessToken
  const refreshToken =
    source?.refreshToken ||
    source?.token?.refreshToken ||
    source?.tokens?.refreshToken

  if (accessToken || refreshToken) {
    saveTokens({ accessToken, refreshToken })
  }
}

export function clearTokens() {
  if (!isBrowser()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export async function apiFetch<T>(
  path: string,
  {
    method = "GET",
    headers,
    body,
    requireAuth,
    credentials = "include",
  }: ApiRequestOptions = {}
): Promise<T> {
  const url =
    path.startsWith("http") || path.startsWith("https")
      ? path
      : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`

  const tokens = getStoredTokens()
  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    ...headers,
  }

  const hasBody = body !== undefined && body !== null
  const isFormData = hasBody && typeof FormData !== "undefined" && body instanceof FormData
  if (hasBody && !isFormData) {
    (requestHeaders as Record<string, string>)["Content-Type"] =
      ((requestHeaders as Record<string, string>)["Content-Type"]) ?? "application/json"
  }

  if (requireAuth && tokens.accessToken) {
    // Use correct type assertion to avoid lint error
    (requestHeaders as Record<string, string>)["Authorization"] = `Bearer ${tokens.accessToken}`
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    credentials,
    body: hasBody
      ? isFormData
        ? body
        : typeof body === "string"
          ? body
          : JSON.stringify(body)
      : undefined,
  })

  const text = await response.text()
  const data = text ? parseJson(text, text) : null

  if (!response.ok) {
    const error: ApiError = {
      message:
        (data && data.message) ||
        (typeof data === "string" ? data : "Request failed"),
      status: response.status,
    }
    throw error
  }

  return data as T
}

function normalizeUserProfile(payload: any): UserProfile {
  const source =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as any).data
      : payload

  if (!source || typeof source !== "object") {
    return source ?? {}
  }

  const id = source.id ?? source.userId
  const role = source.role ?? source.currentRole

  return {
    ...source,
    id,
    userId: id,
    role,
    currentRole: source.currentRole ?? role,
  }
}

// Auth - phone
export async function requestPhoneOtp(phone: string) {
  return apiFetch<{ message?: string }>(
    "/auth/phone/request-otp",
    {
      method: "POST",
      body: { phone },
    }
  )
}

type VerifyPhoneResponse = {
  message?: string
  accessToken?: string
  refreshToken?: string
  user?: UserProfile
}

export async function verifyPhoneOtp(input: {
  phone: string
  code: string
  name?: string
}) {
  return apiFetch<VerifyPhoneResponse>(
    "/auth/phone/verify-otp",
    {
      method: "POST",
      body: input,
    }
  )
}

// Auth - email
export async function registerEmail(input: {
  name: string
  email: string
  password: string
}) {
  return apiFetch<VerifyPhoneResponse>("/auth/email/register", {
    method: "POST",
    body: input,
  })
}

export async function loginEmail(input: { email: string; password: string }) {
  return apiFetch<VerifyPhoneResponse>("/auth/email/login", {
    method: "POST",
    body: input,
  })
}

// Auth - google
export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`
}

// Profile / session
export type MeResponse = UserProfile

export async function fetchMe() {
  const raw = await apiFetch<any>("/auth/me", { requireAuth: true })
  return normalizeUserProfile(raw) as MeResponse
}

export async function refreshTokens() {
  return apiFetch<TokenBundle>("/auth/refresh", {
    method: "POST",
    requireAuth: true,
  })
}

// Roles
export async function applyForRole(role: string, details?: Record<string, any>) {
  return apiFetch<{ message?: string }>("/roles/apply", {
    method: "POST",
    requireAuth: true,
    body: { role, ...details },
  })
}

// Admin
export async function fetchAdminDashboardMetrics() {
  return apiFetch<any>("/admin/dashboard/metrics", {
    requireAuth: true,
  })
}

export async function checkProtected(role: "admin" | "vendor" | "customer" | "rider") {
  return apiFetch<{ message?: string }>(`/protected/${role}`, {
    requireAuth: true,
  })
}
