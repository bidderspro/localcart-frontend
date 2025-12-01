"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getAuthRole, isAuthenticated } from "@/lib/client-auth"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const authed = isAuthenticated()
    const role = getAuthRole()

    if (!authed) {
      router.replace("/auth")
      return
    }

    if (role !== "admin") {
      router.replace("/auth/roles/admin")
      return
    }

    setAllowed(true)
  }, [router])

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm font-semibold text-slate-700">
          Checking admin access...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
