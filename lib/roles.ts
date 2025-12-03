export function routeForRole(role?: string) {
  const normalized = (role ?? "").toLowerCase()
  switch (normalized) {
    case "admin":
    case "super admin":
      return "/admin/analytics"
    case "customer":
      return "/customer/dashboard"
    case "vendor":
      return "/vendor/dashboard"
    case "rider":
      return "/rider/dashboard"
    default:
      return "/apply-role"
  }
}

export function pickUserRole(user?: { role?: string; currentRole?: string; data?: any }) {
  if (!user) return undefined
  const source = (user as any).data && typeof (user as any).data === "object"
    ? (user as any).data
    : user
  return source.role ?? source.currentRole
}
